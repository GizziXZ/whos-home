const Discord = require('discord.js');
const client = new Discord.Client({ intents: ['GuildMessages', 'Guilds'], partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });
const fs = require('fs');
const path = require('path');
const { TOKEN, CLIENTID } = require('./config.json');

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

// LINK - https://open.spotify.com/track/2ymrOUyov4ffcnzkzdQx3c?si=a333ae9675014be7 good music

const commands = [];
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		commands.push(command.data.toJSON());
	}
}

(async () => {
    try {
        console.log(`Started refreshing ${commands.length} application (/) commands.`);
		console.log(client) // whhy is this null wtf (god bless the united states of america 🦅🦅🦅🦅🦅🦅🦅)
        await client.application.commands.set(commands);
        console.log(`Successfully reloaded ${data.length} application (/) commands.`);
    } catch (error) {
        console.error(error);
    }
})();

client.login(TOKEN);