@echo off
cd /d C:\Users\Admin\Desktop\CanConnect
call .venv\Scripts\activate.bat
cd backend
python app.py
pause
