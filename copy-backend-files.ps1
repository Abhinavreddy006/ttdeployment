# PowerShell script to copy newly implemented TMDB, Review, and Watchlist files into your STS project
$destinationPath = "C:\Users\malli\Documents\workspace-spring-tools-for-eclipse-5.2.0.RELEASE\cinerate\src\main\java\com\cinerate\cinerate"
$sourcePath = "$PSScriptRoot\backend-src\com\cinerate\cinerate"

Write-Host "Syncing CineRate backend files to STS workspace..." -ForegroundColor Cyan

# Create destination directories if they don't exist
New-Item -ItemType Directory -Force -Path "$destinationPath\config" | Out-Null
New-Item -ItemType Directory -Force -Path "$destinationPath\service" | Out-Null
New-Item -ItemType Directory -Force -Path "$destinationPath\controller" | Out-Null
New-Item -ItemType Directory -Force -Path "$destinationPath\entity" | Out-Null
New-Item -ItemType Directory -Force -Path "$destinationPath\repository" | Out-Null

# Copy files
Copy-Item -Path "$sourcePath\config\*" -Destination "$destinationPath\config\" -Force
Copy-Item -Path "$sourcePath\service\*" -Destination "$destinationPath\service\" -Force
Copy-Item -Path "$sourcePath\controller\*" -Destination "$destinationPath\controller\" -Force
Copy-Item -Path "$sourcePath\entity\*" -Destination "$destinationPath\entity\" -Force
Copy-Item -Path "$sourcePath\repository\*" -Destination "$destinationPath\repository\" -Force

Write-Host "✅ All Java backend files successfully synchronized!" -ForegroundColor Green
Write-Host "In STS: Right-click your project -> Refresh (F5), then restart your Spring Boot Application." -ForegroundColor Yellow
