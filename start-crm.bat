@echo off
echo ============================================================
echo   AI-Enhanced CRM System - Startup Script
echo ============================================================

echo [1/2] Checking Oracle XE...
sc query OracleServiceXE | find "RUNNING" >nul
if %errorlevel% neq 0 (
    echo Starting Oracle XE...
    net start OracleServiceXE
    net start OracleXETNSListener
    timeout /t 5
) else (
    echo Oracle XE is already running.
)

echo.
echo [2/2] Starting Microservices...
echo NOTE: Start services in this order:
echo   1. Eureka Server    -> http://localhost:8761
echo   2. Config Server    -> http://localhost:8888
echo   3. API Gateway      -> http://localhost:8080
echo   4. Auth Service     -> http://localhost:8081
echo   5. Customer Service -> http://localhost:8082
echo   6. Lead Service     -> http://localhost:8083
echo   7. Analytics Service-> http://localhost:8084
echo   8. Recommendation   -> http://localhost:8085
echo   9. Notification     -> http://localhost:8086
echo  10. Task Service     -> http://localhost:8087
echo  11. Social Analytics -> http://localhost:8088
echo  12. React Frontend   -> http://localhost:3000
echo.
echo To build all services: cd D:\crm-system\backend ^&^& mvn clean package -DskipTests
echo To start frontend:     cd D:\crm-system\frontend\crm-frontend ^&^& npm run dev
echo.
pause
