$WshShell = New-Object -comObject WScript.Shell
$DesktopPath = [Environment]::GetFolderPath("Desktop")
$Shortcut = $WshShell.CreateShortcut("$DesktopPath\MKisans.lnk")
$Shortcut.TargetPath = "d:\Desktop\Mkisans\Start_Mkisans.bat"
$Shortcut.WorkingDirectory = "d:\Desktop\Mkisans"
$Shortcut.IconLocation = "d:\Desktop\Mkisans\app\assets\icon.ico"
$Shortcut.Save()
