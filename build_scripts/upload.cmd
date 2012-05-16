@echo off
"python.exe" -u "prepare-to-upload.py"
IF %ERRORLEVEL% == 0  "python.exe" -u "appcfg.py" --no_cookies update "..\"