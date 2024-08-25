# Who's home?
![image](https://github.com/user-attachments/assets/288cdb60-5187-4a2d-9299-dfccf7ae1c19)

Wifi monitoring through discord

This is a valuable bot to host especially if you've got a raspberry pi, whether you're trying to monitor your wifi for hackers or a tech savvy delinquent teen (like me) trying to check which family members are at home while you smell like cigarettes, this bot has you covered.

## Features

- **Real-Time Device Monitoring**: Instantly see all devices connected to your Wi-Fi network and get notifications on untrusted Wifi connections.
- **Trusted Device Management**: Easily add and manage trusted devices.
- **Device Identification**: Automatic mac address lookup to help you identify which devices are which.

### Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/gizzixz/whos-home.git
    ```
2. Install dependencies
    ```sh
    npm i
    ```
3. Create a `config.json` file and follow this template
    ```json
    {
    "TOKEN": "Your discord bot token",
    "GUILDID": "Your server id (we aren't using global slash commands)"
    }
    ```
4. If you are going to host this on a device to be left open (preferably a raspberry pi), install pm2 to host it (if not just use `node index.js`)
    ```sh
    npm i pm2
    ```
5. Use pm2 to start hosting
    ```sh
    pm2 start index.js
    ```
