Set oWS = WScript.CreateObject("WScript.Shell")
sLinkFile = oWS.ExpandEnvironmentStrings("%USERPROFILE%\Desktop\MKisans.lnk")
Set oLink = oWS.CreateShortcut(sLinkFile)
oLink.TargetPath = "d:\Desktop\Mkisans\Start_Mkisans.bat"
oLink.WorkingDirectory = "d:\Desktop\Mkisans"
oLink.IconLocation = "d:\Desktop\Mkisans\app\assets\icon.ico"
oLink.Save
