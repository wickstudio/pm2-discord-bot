# PM2 Discord Bot

A powerful Discord bot to manage and monitor your PM2 processes directly from your Discord server. This bot allows you to list, start, stop, and restart your PM2 processes with ease, all through simple Discord commands.

## Features

- **List PM2 Processes** : View a paginated list of all running PM2 processes, including their name, status, folder, and uptime.
- **Manage Processes** : Start, stop, and restart individual processes or all processes at once.
- **Dynamic Uptime** : Displays real-time uptime using Discord's timestamp feature.
- **User Restriction** : Restrict bot commands to specific users only.

## Installation

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/wickstudio/pm2-discord-bot.git
   cd pm2-discord-bot
   ```

2. **Run the Installer:**
   Simply run `install.bat` to check for Node.js and install required packages.
   ```bash
   ./install.bat
   ```

3. **Configure and Start the Bot:**
   Run `start.bat` to set up your `config.js` with your bot token, user ID, and other settings.
   ```bash
   ./start.bat
   ```

4. **You're All Set!**
   The bot will now run and respond to commands in your Discord server.

## Commands

- **`list`** : Lists all running PM2 processes.
- **`start [ID]`** : Starts a PM2 process by its ID.
- **`stop [ID]`** : Stops a PM2 process by its ID.
- **`restart [ID]`** : Restarts a PM2 process by its ID.
- **`restart all`** : Restarts all running PM2 processes.

## Configuration

All configuration settings are stored in `config.js`:

- **`token`**: Your Discord bot token.
- **`allowedUsers`**: An array of user IDs that are allowed to use the bot commands.
- **`pageSize`**: Number of PM2 processes displayed per page.
- **`prefix`**: The command prefix used for bot commands (e.g., `-`).

## Support

For support, join our [Discord server](https://discord.gg/wicks).

## Credits

This bot is developed and maintained by **Wick Studio**.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.