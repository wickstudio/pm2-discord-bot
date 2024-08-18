@echo off

:: Ask for configuration details
set /p TOKEN="Enter your Discord bot token: "
set /p USER_ID="Enter your Discord user ID: "
set /p PAGE_SIZE="Enter the number of processes per page: "
set /p PREFIX="Enter the command prefix (e.g., -): "

:: Create config.js file
echo module.exports = { > config.js
echo.    token: '%TOKEN%', >> config.js
echo.    allowedUsers: ['%USER_ID%'], >> config.js
echo.    pageSize: %PAGE_SIZE%, >> config.js
echo.    prefix: '%PREFIX%', >> config.js
echo }; >> config.js

:: Start the bot
echo Starting the bot...
node index.js

pause
