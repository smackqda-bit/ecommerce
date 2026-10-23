@echo off
chcp 65001 >nul
title VNE PLANA - push to GitHub
cd /d "%~dp0"
where git >nul 2>nul || (echo Git не найден. Установите с https://git-scm.com и запустите снова. & pause & exit /b 1)
if not exist .git git init -b main
git config user.name >nul 2>nul || git config user.name "smackqda-bit"
git config user.email >nul 2>nul || git config user.email "smackq.da@gmail.com"
git remote get-url origin >nul 2>nul && git remote set-url origin https://github.com/smackqda-bit/ecommerce.git || git remote add origin https://github.com/smackqda-bit/ecommerce.git
git add -A
git commit -m "ВНЕ ПЛАНА: Next.js-магазин, все страницы и анимации" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>" > push-log.txt 2>&1
git branch -M main
git push -u origin main >> push-log.txt 2>&1
echo EXIT %errorlevel% >> push-log.txt
type push-log.txt
pause
