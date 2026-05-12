# Create Desktop Shortcut for MKisans Zonal Officer
$Shell = New-Object -ComObject WScript.Shell
$DesktopPath = [System.IO.Path]::Combine($env:USERPROFILE, "Desktop")
$ShortcutPath = [System.IO.Path]::Combine($DesktopPath, "MKisans Zonal Officer.lnk")
$Shortcut = $Shell.CreateShortcut($ShortcutPath)
$Shortcut.TargetPath = "powershell.exe"
$Shortcut.Arguments = "-ExecutionPolicy Bypass -File `"$PSScriptRoot\run_all.ps1`""
$Shortcut.WorkingDirectory = $PSScriptRoot
$Shortcut.WindowStyle = 1
$Shortcut.Description = "Launch MKisans Zonal Officer Platform"
$Shortcut.Save()

Write-Host "✅ Desktop shortcut created: $ShortcutPath" -ForegroundColor Green
