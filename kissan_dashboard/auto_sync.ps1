# MKisans Auto-Sync Script
# This script watches for file changes and automatically pushes them to GitHub.

$watcher = New-Object System.IO.FileSystemWatcher
$watcher.Path = Get-Location
$watcher.IncludeSubdirectories = $true
$watcher.EnableRaisingEvents = $true

# Define what to ignore
$ignorePatterns = @("node_modules", ".git", "*.db", "*.log", "dist", "build", "package-lock.json")

Write-Host "🚀 MKisans Auto-Sync is running..." -ForegroundColor Cyan
Write-Host "Watching: $($watcher.Path)"
Write-Host "Press Ctrl+C to stop.`n"

$lastChange = Get-Date
$isPending = $false

Action = {
    $path = $Event.SourceEventArgs.FullPath
    $name = $Event.SourceEventArgs.Name
    
    # Check if we should ignore this change
    foreach ($pattern in $ignorePatterns) {
        if ($path -like "*$pattern*") { return }
    }

    $global:lastChange = Get-Date
    $global:isPending = $true
    Write-Host "[$(Get-Date -Format 'HH:mm:ss')] Change detected: $name" -ForegroundColor Yellow
}

Register-ObjectEvent $watcher "Changed" -Action $Action | Out-Null
Register-ObjectEvent $watcher "Created" -Action $Action | Out-Null
Register-ObjectEvent $watcher "Deleted" -Action $Action | Out-Null
Register-ObjectEvent $watcher "Renamed" -Action $Action | Out-Null

while($true) {
    if ($global:isPending -and (New-TimeSpan -Start $global:lastChange -End (Get-Date)).TotalSeconds -gt 10) {
        Write-Host "`n📦 Auto-committing changes..." -ForegroundColor Blue
        
        git add .
        $status = git status --porcelain
        
        if ($status) {
            $commitMsg = "Auto-update: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
            git commit -m $commitMsg
            Write-Host "📤 Pushing to GitHub..." -ForegroundColor Green
            git push origin main
            Write-Host "✅ Sync complete!`n" -ForegroundColor Green
        } else {
            Write-Host "ℹ️ No changes to commit.`n"
        }
        
        $global:isPending = $false
    }
    Start-Sleep -Seconds 5
}
