@echo off
chcp 65001 >nul
title VNE PLANA dev
cd /d "%~dp0"
where node >nul 2>nul || (echo Node.js не найден. Установите LTS с https://nodejs.org и запустите снова. & pause & exit /b 1)
node -v
if not exist node_modules (echo Устанавливаю зависимости... & call npm install || (pause & exit /b 1))
echo Запускаю сайт: http://localhost:3000
call npm run dev
pause
