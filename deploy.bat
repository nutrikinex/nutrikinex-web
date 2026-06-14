@echo off
echo ===================================================
echo   NutriKinex Web Sitesi Canliya Alma (Deployment)  
echo ===================================================
echo.

echo [1/3] Degisiklikler Stage Ediliyor (git add)...
git add .
echo.

echo [2/3] Degisiklikler Kaydediliyor (git commit)...
git commit -m "Website update via automated script"
echo.

echo [3/3] Kodlar GitHub'a Yukleniyor (git push)...
git push
echo.

echo ===================================================
echo  [Basarili!] Siteniz 1-2 dakika icinde guncellenecektir.
echo ===================================================
echo.
pause
