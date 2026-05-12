# MKisans Zonal Officer Platform - Startup Script
$ErrorActionPreference = 'Stop'

Write-Host "🌾 Starting Zonal Officer Platform..." -ForegroundColor Green

$BaseDir = $PSScriptRoot
if (-not $BaseDir) { $BaseDir = Get-Location }

# Function to start a service in a new window
function Start-ServiceWindow {
    param($Name, $Path, $Command)
    Write-Host "🚀 Starting $Name..." -ForegroundColor Cyan
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$Path'; $Command"
}

# Start Backend
Start-ServiceWindow -Name "Backend" -Path "$BaseDir\backend" -Command "node server.js"

# Start Frontend
Start-ServiceWindow -Name "Frontend" -Path "$BaseDir\frontend" -Command "npm run dev"

# Start Mobile App (Expo)
Start-ServiceWindow -Name "Mobile App" -Path "$BaseDir\app" -Command "npx expo start"

Write-Host "`n✅ All services have been triggered in separate windows." -ForegroundColor Green
Write-Host "Please check the individual terminal windows for logs."
