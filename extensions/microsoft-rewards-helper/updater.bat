@echo off

title Microsoft Rewards Helper Updater
color 1f
echo [104m[[4mMicrosoft Rewards Helper Updater[24m]
echo [44mChecking for updates...

:: get the latest manifest version from github
for /f "tokens=*" %%d in ('curl -s https://raw.githubusercontent.com/Hammer-01/hammer-01.github.io/main/extensions/microsoft-rewards-helper/manifest.json ^| findstr "\"version\""') do set "newVersion=%%d"

:: get the current manifest version from the local extension
for /f "tokens=*" %%d in ('findstr "\"version\"" manifest.json') do set "currentVersion=%%d"

:: remove the quotes to make comparison easier
set currentVersion=%currentVersion:"=%
set newVersion=%newVersion:"=%

:: remove trailing comma if it exists
if "%currentVersion:~-1%" == "," set currentVersion=%currentVersion:~0,-1%
if "%newVersion:~-1%" == "," set newVersion=%newVersion:~0,-1%

if "%currentVersion%" neq "%newVersion%" (
    echo [5mUpdating... [25;93m^(%currentVersion% -^> %newVersion%^)
    setlocal enabledelayedexpansion

    :: get a list of the files in the extension repo. skip the first line, which should just be an open square bracket ([)
    for /f "skip=1 tokens=1* delims=:" %%l in ('curl -s https://api.github.com/repos/Hammer-01/hammer-01.github.io/contents/extensions/microsoft-rewards-helper') do (
        :: format keys and values to make them easier to work with, remove quotes
        set "key=%%l"
        set "val=%%m"
        set "key=!key:"=!"
        set "val=!val:"=!"
        set "key=!key: =!"
        set "val=!val:~1!"
        if "!val:~-1!" == "," set "val=!val:~0,-1!"

        :: ignore the zip file and download the rest of the files
        if "!key!" == "name" if "!val!" == "Microsoft Rewards Helper.zip" (set name=) else set name=!val!
        if "!key!" == "download_url" if defined name (
            echo [3;33mDownloading !name!...
            curl -s -o "!name!" "!val!"
            echo [1F[23;92mDownloading !name!... Done
        )
    )
    echo.
    echo [92mExtension is up to date^^!
    echo [3H[97mUpdating...
) else echo [92mExtension is up to date [93m(%currentVersion%)

timeout 3 >nul