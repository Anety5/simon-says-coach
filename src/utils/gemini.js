// Google Gemini AI Integration for Simon Says Coach
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini with API key from .env
const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY;

console.log('Gemini API Key loaded:', apiKey ? 'Yes (' + apiKey.substring(0, 10) + '...)' : 'NO KEY FOUND!');

const genAI = new GoogleGenerativeAI(apiKey);

// Exponential backoff with jitter for retries
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const exponentialBackoffWithJitter = async (fn, maxRetries = 3, baseDelay = 1000) => {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      // Don't retry on quota errors (429) or auth errors (401, 403)
      if (error.status === 429 || error.status === 401 || error.status === 403) {
        throw error;
      }
      
      // Last attempt - throw error
      if (attempt === maxRetries - 1) {
        throw error;
      }
      
      // Calculate delay with exponential backoff and jitter
      const exponentialDelay = baseDelay * Math.pow(2, attempt);
      const jitter = Math.random() * exponentialDelay * 0.3; // 30% jitter
      const totalDelay = exponentialDelay + jitter;
      
      console.log(`Retry attempt ${attempt + 1}/${maxRetries} after ${Math.round(totalDelay)}ms`);
      await sleep(totalDelay);
    }
  }
};

// Coach personality system prompts
const COACH_PROMPTS = {
  productivity: `You are a Productivity Coach, like Alfred to Batman - sophisticated, proactive, and immediately helpful. No pleasantries. Every response must contain concrete action steps.

Your approach:
- Lead with a specific framework or method (Eisenhower Matrix, Pomodoro, Time-blocking)
- Give 2-3 immediate actions they can take in the next 10 minutes
- Be direct about what's working and what's not
- Suggest systems, not just advice
- Follow up with accountability questions

Never say "let me help you with that" - just help. No fluff. Pure tactical execution.`,

  strategy: `You are a Strategy Coach - a master of long-term thinking. Every response includes a specific framework and decision criteria.

Your approach:
- Name the strategic framework (SWOT, Jobs to be Done, Playing to Win)
- Ask one powerful question that reframes their situation
- Provide a decision matrix or criteria
- Identify the 1-2 highest leverage actions
- Challenge assumptions directly

No vague advice. Give them the mental model to make the decision themselves.`,

  growth: `You are a Growth Coach - a career accelerator. Every response identifies a specific skill or opportunity.

Your approach:
- Pinpoint the exact skill gap or growth edge
- Recommend one specific resource (book, course, person to learn from)
- Give a 30-day micro-plan
- Identify blind spots without sugar-coating
- Connect their goal to a concrete outcome

No generic encouragement. Show them the fastest path forward.`,

  focus: `You are a Focus Coach - a deep work architect. Every response includes a specific attention technique.

Your approach:
- Diagnose the distraction pattern (digital, environmental, internal)
- Prescribe a specific protocol (Pomodoro variant, time-boxing, shutdown ritual)
- Give environmental design instructions
- Set a focus challenge for their next session
- Track depth of work, not hours

No motivation talks. Build their attention like a muscle with specific exercises.`,

  wellness: `You are a Wellness Coach - a sustainability engineer. Every response balances ambition with recovery.

Your approach:
- Identify the burnout signal (physical, emotional, mental)
- Prescribe a specific recovery protocol
- Redesign their energy allocation (not time management)
- Challenge hustle culture directly
- Give permission to rest strategically

No "self-care" platitudes. Treat rest as performance engineering.`,

  creative: `You are a Creative Coach - an innovation catalyst. Every response generates new ideas or breaks blocks.

Your approach:
- Use a specific ideation technique (SCAMPER, Forced Connections, Constraints)
- Generate 3 terrible ideas to unlock the good ones
- Reframe the problem from a different angle
- Give a 10-minute creative sprint
- Celebrate experimentation over execution

No "be more creative" advice. Run them through a concrete creative process.`
};

/**
 * Generate AI coaching response using Gemini REST API
 * @param {string} coachType - The type of coach (productivity, strategy, etc.)
 * @param {array} conversationHistory - Previous messages for context
 * @param {object} userProfile - User's name, profession, focus, tone preferences
 * @param {string} imageBase64 - Optional base64 encoded image
 * @returns {Promise<string>} - The coach's response
 */
export const generateCoachResponse = async (coachType, conversationHistory, userProfile = {}, imageBase64 = null) => {
  try {
    // Get the appropriate coach personality
    const systemPrompt = COACH_PROMPTS[coachType] || COACH_PROMPTS.productivity;
    
    // Add user context to the system prompt
    let contextualPrompt = systemPrompt;
    
    if (userProfile.name) {
      contextualPrompt += `\n\nYou are coaching ${userProfile.name}`;
    }
    
    if (userProfile.profession) {
      contextualPrompt += `, who works as a ${userProfile.profession}`;
    }
    
    if (userProfile.focus) {
      contextualPrompt += `. They are currently focused on: ${userProfile.focus}`;
    }
    
    // Add tone preferences
    if (userProfile.tone) {
      const { formality, directness, detail } = userProfile.tone;
      
      contextualPrompt += `\n\nAdjust your communication style:`;
      
      if (formality <= 2) {
        contextualPrompt += `\n- Be casual and conversational (formality level: ${formality}/5)`;
      } else if (formality >= 4) {
        contextualPrompt += `\n- Be professional and formal (formality level: ${formality}/5)`;
      }
      
      if (directness >= 4) {
        contextualPrompt += `\n- Be very direct and to-the-point (directness level: ${directness}/5)`;
      } else if (directness <= 2) {
        contextualPrompt += `\n- Be gentle and nuanced (directness level: ${directness}/5)`;
      }
      
      if (detail >= 4) {
        contextualPrompt += `\n- Provide detailed, comprehensive answers (detail level: ${detail}/5)`;
      } else if (detail <= 2) {
        contextualPrompt += `\n- Keep responses brief and concise (detail level: ${detail}/5)`;
      }
    }
    
    contextualPrompt += `\n\nIMPORTANT: Be immediately actionable. No pleasantries or "let me help" - just deliver concrete next steps. Keep under 120 words unless they ask for deep analysis.`;
    
    // Build conversation contents for API
    const contents = [
      {
        role: 'user',
        parts: [{ text: 'You are my coach. Here is your role and instructions: ' + contextualPrompt }]
      },
      {
        role: 'model',
        parts: [{ text: 'Understood. I will coach you according to these principles. What would you like to work on?' }]
      }
    ];
    
    // Add conversation history
    conversationHistory.slice(0, -1).forEach(msg => {
      contents.push({
        role: msg.role === 'coach' ? 'model' : 'user',
        parts: [{ text: msg.text }]
      });
    });
    
    // Add latest user message
    const latestMessage = conversationHistory[conversationHistory.length - 1].text;
    const latestParts = [{ text: latestMessage }];
    
    // Add image if provided
    if (imageBase64) {
      latestParts.push({
        inline_data: {
          mime_type: 'image/jpeg',
          data: imageBase64
        }
      });
    }
    
    contents.push({
      role: 'user',
      parts: latestParts
    });
    
    console.log('Sending to Gemini:', {
      coachType,
      historyLength: contents.length,
      userMessage: latestMessage,
      hasImage: !!imageBase64
    });
    
    // Wrap API call in retry logic with exponential backoff and jitter
    const apiCall = async () => {
      const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: contents,
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 500,
            }
          })
        }
      );
      
      const data = await response.json();
      
      if (!response.ok) {
        const error = new Error(JSON.stringify(data.error || data));
        error.status = response.status;
        throw error;
      }
      
      return data.candidates[0].content.parts[0].text;
    };
    
    const text = await exponentialBackoffWithJitter(apiCall);
    
    console.log('Gemini response received:', text.substring(0, 100));
    
    return text;
    
  } catch (error) {
    console.error('Gemini API Error Details:', {
      message: error.message,
      status: error.status,
      statusText: error.statusText,
      response: error.response,
      fullError: error
    });
    
    // Fallback response if API fails
    return "I'm having trouble connecting right now. Could you try asking your question again? In the meantime, take a moment to reflect on what outcome you're hoping for.";
  }
};

/**
 * Get a random inspirational quote
 * @returns {string} - An inspirational quote
 */
export const getRandomQuote = () => {
  const quotes = [
    "The secret of getting ahead is getting started.",
    "Focus on being productive instead of busy.",
    "You don't have to be great to start, but you have to start to be great.",
    "The way to get started is to quit talking and begin doing.",
    "Success is the sum of small efforts repeated day in and day out.",
    "Progress, not perfection.",
    "Done is better than perfect.",
    "What you do today can improve all your tomorrows.",
    "The future depends on what you do today.",
    "Small daily improvements are the key to staggering long-term results.",
  ];
  
  return quotes[Math.floor(Math.random() * quotes.length)];
};
