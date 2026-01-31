# Resize PNG images for app icons
# Usage: .\resize-icon.ps1

$source = "assets\icon.png"

if (-not (Test-Path $source)) {
    Write-Error "Source file not found: $source"
    exit 1
}

# Load .NET assembly for image manipulation
Add-Type -AssemblyName System.Drawing

# Load source image
$img = [System.Drawing.Image]::FromFile((Resolve-Path $source))

# Function to resize and save
function Resize-Image {
    param($width, $height, $outputPath)
    
    $bitmap = New-Object System.Drawing.Bitmap($width, $height)
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $graphics.DrawImage($img, 0, 0, $width, $height)
    
    $bitmap.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $graphics.Dispose()
    $bitmap.Dispose()
    
    Write-Host "Created: $outputPath"
}

# Create remaining icon sizes from icon.png
Resize-Image 512 512 "assets\splash-icon.png"
Resize-Image 192 192 "assets\favicon.png"

# Cleanup
$img.Dispose()

Write-Host "`nIcons created successfully!" -ForegroundColor Green
Write-Host "- splash-icon.png (512x512)"
Write-Host "- favicon.png (192x192)"
Write-Host "`nYou can now rebuild the APK/AAB with the new terracotta icons."
