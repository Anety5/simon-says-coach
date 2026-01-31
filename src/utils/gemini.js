// Google Gemini AI Integration for Simon Says Coach
import { GoogleGenerativeAI } from '@google/generative-ai';
import Constants from 'expo-constants';

// Initialize Gemini with API key from .env
const apiKey = Constants.expoConfig?.extra?.EXPO_PUBLIC_GEMINI_API_KEY || 
               process.env.EXPO_PUBLIC_GEMINI_API_KEY;

console.log('Gemini API Key loaded:', apiKey ? 'Yes (' + apiKey.substring(0, 10) + '...)' : 'NO KEY FOUND!');

if (!apiKey) {
  console.error('❌ CRITICAL: Gemini API key is missing! App will not function properly.');
}

const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

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
  productivity: `You are a Productivity Coach, like Alfred to Batman - sophisticated, proactive, and immediately helpful. You understand that productivity is emotional, not just tactical.

Your approach:
- Acknowledge their feelings first ("I hear the overwhelm in your situation")
- Lead with a specific framework or method (Eisenhower Matrix, Pomodoro, Time-blocking)
- Give 2-3 immediate actions they can take in the next 10 minutes
- Be direct about what's working and what's not
- Suggest systems, not just advice
- Celebrate small wins to build momentum
- Follow up with accountability questions

Show empathy without being soft. Pure tactical execution with emotional intelligence.`,

  strategy: `You are a Strategy Coach - a master of long-term thinking. Every response includes a specific framework and decision criteria.

Your approach:
- Name the strategic framework (SWOT, Jobs to be Done, Playing to Win)
- Ask one powerful question that reframes their situation
- Provide a decision matrix or criteria
- Identify the 1-2 highest leverage actions
- Challenge assumptions directly

No vague advice. Give them the mental model to make the decision themselves.`,

  growth: `You are a Growth Coach - a career accelerator with deep empathy for the courage growth requires.

Your approach:
- Start with validation ("Growth edges are uncomfortable - that's the signal you're on the right path")
- Pinpoint the exact skill gap or growth opportunity
- Recommend one specific resource (book, course, person to learn from)
- Give a 30-day micro-plan
- Identify blind spots with compassion
- Connect their goal to their deeper why
- Mirror their ambition back to them

Balance challenge with encouragement. Show them the fastest path forward while honoring their fears.`,

  focus: `You are a Focus Coach - a deep work architect. Every response includes a specific attention technique.

Your approach:
- Diagnose the distraction pattern (digital, environmental, internal)
- Prescribe a specific protocol (Pomodoro variant, time-boxing, shutdown ritual)
- Give environmental design instructions
- Set a focus challenge for their next session
- Track depth of work, not hours

No motivation talks. Build their attention like a muscle with spe who deeply understands burnout. Every response balances ambition with recovery and validates their exhaustion.

Your approach:
- Lead with emotional validation ("Burnout isn't weakness - it's data")
- Identify the burnout signal (physical, emotional, mental)
- Prescribe a specific recovery protocol
- Redesign their energy allocation (not time management)
- Challenge hustle culture with compassion
- Give permission to rest strategically
- Use mirror neurons: "When you smile, even forced, your brain releases feel-good chemicals"

Show them that rest is productive. Self-compassion is the foundation of sustainable achievement.`,

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
    console.log('=== generateCoachResponse called ===');
    console.log('coachType:', coachType);
    console.log('userProfile:', userProfile);
    console.log('conversationHistory length:', conversationHistory?.length);
    
    // Get the appropriate coach personality
    const systemPrompt = COACH_PROMPTS[coachType] || COACH_PROMPTS.productivity;
    
    // Add user context to the system prompt (with null checks)
    let contextualPrompt = systemPrompt;
    
    if (userProfile && userProfile.name) {
      contextualPrompt += `\n\nYou are coaching ${userProfile.name}`;
    }
    
    if (userProfile && userProfile.profession) {
      contextualPrompt += `, who works as a ${userProfile.profession}`;
    }
    
    if (userProfile && userProfile.focus) {
      contextualPrompt += `. They are currently focused on: ${userProfile.focus}`;
    }
    
    // Add tone preferences (with null checks)
    if (userProfile && userProfile.tone) {
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
    
    // Check if API key exists
    if (!apiKey) {
      throw new Error('Gemini API key is not configured. Please add EXPO_PUBLIC_GEMINI_API_KEY to your .env file.');
    }
    
    // Wrap API call in retry logic with exponential backoff and jitter
    const apiCall = async () => {
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
              maxOutputTokens: 2048,
            }
          })
        }
      );
      
      const data = await response.json();
      
      console.log('Gemini API response:', JSON.stringify(data).substring(0, 200));
      
      if (!response.ok) {
        const errorMsg = data?.error?.message || JSON.stringify(data);
        const error = new Error(errorMsg);
        error.status = response.status;
        error.data = data;
        throw error;
      }
      
      // Safely parse response with null checks
      if (!data.candidates || data.candidates.length === 0) {
        throw new Error('No candidates in response: ' + JSON.stringify(data));
      }
      
      const candidate = data.candidates[0];
      if (!candidate.content || !candidate.content.parts || candidate.content.parts.length === 0) {
        throw new Error('Invalid response structure: ' + JSON.stringify(candidate));
      }
      
      const responseText = candidate.content.parts[0].text;
      const finishReason = candidate.finishReason;
      
      console.log('Gemini finish reason:', finishReason);
      console.log('Response text length:', responseText?.length || 0);
      
      if (finishReason === 'MAX_TOKENS') {
        console.warn('Response was truncated due to max tokens');
      }
      
      return responseText;
    };
    
    const text = await exponentialBackoffWithJitter(apiCall);
    
    console.log('Gemini response received:', text);
    
    return text;
    
  } catch (error) {
    console.error('Gemini API Error Details:', {
      message: error.message,
      status: error.status,
      statusText: error.statusText,
      response: error.response,
      fullError: error
    });
    
    // Show specific error messages to help debug
    let errorMessage = "I'm having trouble connecting. ";
    
    if (!apiKey) {
      errorMessage += "Error: API key not found. Check .env file.";
    } else if (error.message && error.message.includes('API key')) {
      errorMessage += "Error: Invalid API key. Please check your Gemini API configuration.";
    } else if (error.status === 429) {
      errorMessage += "Error: API quota exceeded. Please try again later.";
    } else if (error.status === 403 || error.status === 401) {
      errorMessage += "Error: API authentication failed. Check your API key permissions.";
    } else if (error.message && error.message.includes('network')) {
      errorMessage += "Error: Network connection failed. Check your internet.";
    } else if (error.message) {
      errorMessage += `Error: ${error.message.substring(0, 100)}`;
    } else {
      errorMessage += "Unknown error occurred. Please try again.";
    }
    
    return errorMessage;
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
