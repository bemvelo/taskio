@echo off
echo Starting Taskio...
cd /d %~dp0
call backend\venv\Scripts\activate
python start.py
pause