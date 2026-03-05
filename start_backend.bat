@echo off
echo Iniciando o servidor backend da NASA APOD...
cd /d "%~dp0backend"
call venv\Scripts\activate.bat
python -m uvicorn main:app --reload
pause
