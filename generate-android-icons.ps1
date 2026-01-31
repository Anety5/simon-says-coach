# Generate Android app icons from icon.png
# Requires: .NET System.Drawing and WebP support

Add-Type -AssemblyName System.Drawing

$sourceIcon = "assets\icon.png"
$iconSizes = @{
    "mdpi" = 48
    "hdpi" = 72
    "xhdpi" = 96
    "xxhdpi" = 144
    "xxxhdpi" = 192
}

Write-Host "Generating Android app icons from $sourceIcon..." -ForegroundColor Cyan

if (-not (Test-Path $sourceIcon)) {
    Write-Host "ERROR: Source icon not found at $sourceIcon" -ForegroundColor Red
    exit 1
}

# Load source image
$sourceImage = [System.Drawing.Image]::FromFile((Resolve-Path $sourceIcon).Path)

foreach ($density in $iconSizes.Keys) {
    $size = $iconSizes[$density]
    $outputDir = "android\app\src\main\res\mipmap-$density"
    
    Write-Host "Creating ${size}x${size} icons for $density..." -ForegroundColor Yellow
    
    if (-not (Test-Path $outputDir)) {
        New-Item -ItemType Directory -Path $outputDir -Force | Out-Null
    }
    
    # Create bitmap at target size
    $bitmap = New-Object System.Drawing.Bitmap($size, $size)
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    
    # High quality resize
    $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $graphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
    
    # Draw resized image
    $graphics.DrawImage($sourceImage, 0, 0, $size, $size)
    
    # Save as PNG first (WebP conversion would need external tool)
    $pngPath = "$outputDir\ic_launcher.png"
    $bitmap.Save($pngPath, [System.Drawing.Imaging.ImageFormat]::Png)
    
    # Also save as round icon (same for now)
    $pngRoundPath = "$outputDir\ic_launcher_round.png"
    $bitmap.Save($pngRoundPath, [System.Drawing.Imaging.ImageFormat]::Png)
    
    # Save as foreground (same for now)
    $pngForegroundPath = "$outputDir\ic_launcher_foreground.png"
    $bitmap.Save($pngForegroundPath, [System.Drawing.Imaging.ImageFormat]::Png)
    
    $graphics.Dispose()
    $bitmap.Dispose()
    
    Write-Host "  Created: $pngPath" -ForegroundColor Green
}

$sourceImage.Dispose()

Write-Host "`nDone! PNG icons created in all mipmap folders." -ForegroundColor Green
Write-Host "Note: Android will automatically use PNG icons. If you need WebP, use an online converter." -ForegroundColor Cyan
Write-Host "`nNext steps:" -ForegroundColor Yellow
Write-Host "  1. Delete old .webp files: Get-ChildItem android\app\src\main\res\mipmap-*\*.webp | Remove-Item" -ForegroundColor White
Write-Host "  2. Rebuild APK: cd android; .\gradlew assembleRelease" -ForegroundColor White
