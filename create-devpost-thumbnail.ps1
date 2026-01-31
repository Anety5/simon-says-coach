# Create Devpost Thumbnail
# Usage: .\create-devpost-thumbnail.ps1

$iconSource = "assets\icon.png"
$outputPath = "assets\devpost-thumbnail.png"

if (-not (Test-Path $iconSource)) {
    Write-Error "Icon file not found: $iconSource"
    exit 1
}

# Load .NET assembly for image manipulation
Add-Type -AssemblyName System.Drawing

# Thumbnail dimensions (1280x720 - standard 16:9 format for Devpost)
$width = 1280
$height = 720

# Create blank canvas with white background
$thumbnail = New-Object System.Drawing.Bitmap($width, $height)
$graphics = [System.Drawing.Graphics]::FromImage($thumbnail)
$graphics.Clear([System.Drawing.Color]::FromArgb(250, 250, 250))  # Light gray background (#FAFAFA)
$graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic

# Load icon
$icon = [System.Drawing.Image]::FromFile((Resolve-Path $iconSource))

# Calculate icon placement (centered, reasonable size)
$iconSize = 300
$iconX = ($width - $iconSize) / 2
$iconY = ($height - $iconSize) / 2 - 60  # Shift up slightly for text

# Draw icon
$graphics.DrawImage($icon, $iconX, $iconY, $iconSize, $iconSize)

# Add app name below icon
$appName = "Simon Says Coach"
$font = New-Object System.Drawing.Font("Segoe UI", 48, [System.Drawing.FontStyle]::Bold)
$textBrush = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(26, 26, 26))  # Dark text (#1A1A1A)

# Measure text to center it
$textSize = $graphics.MeasureString($appName, $font)
$textX = ($width - $textSize.Width) / 2
$textY = $iconY + $iconSize + 40

# Draw text
$graphics.DrawString($appName, $font, $textBrush, $textX, $textY)

# Add tagline
$tagline = "AI Coaching That Gets You"
$taglineFont = New-Object System.Drawing.Font("Segoe UI", 24, [System.Drawing.FontStyle]::Regular)
$taglineBrush = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(107, 107, 107))  # Gray text (#6B6B6B)

$taglineSize = $graphics.MeasureString($tagline, $taglineFont)
$taglineX = ($width - $taglineSize.Width) / 2
$taglineY = $textY + $textSize.Height + 10

$graphics.DrawString($tagline, $taglineFont, $taglineBrush, $taglineX, $taglineY)

# Save
$thumbnail.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)

# Cleanup
$graphics.Dispose()
$thumbnail.Dispose()
$icon.Dispose()
$font.Dispose()
$taglineFont.Dispose()
$textBrush.Dispose()
$taglineBrush.Dispose()

Write-Host "✅ Devpost thumbnail created: $outputPath" -ForegroundColor Green
Write-Host "   Size: 1280x720px (16:9 format)" -ForegroundColor Gray
