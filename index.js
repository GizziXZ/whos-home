const Discord = require('discord.js');
const client = new Discord.Client({ intents: ['GuildMessages', 'Guilds'], partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });
const fs = require('fs');
const path = require('path');
const { TOKEN, GUILDID } = require('./config.json');

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
		commands.push(command);
	}
}

client.once('ready', async () => {
    console.log(`Logged in as ${client.user.tag}!`);
    try {
        // console.log(`Started refreshing ${commands.length} application (/) commands.`);
        // await client.application.commands.set(commands);
        // console.log(`Successfully reloaded ${commands.length} application (/) commands.`);
        console.log(`Started refreshing ${commands.length} GUILD (/) commands.`);
		const guild = await client.guilds.fetch(GUILDID);
		await guild.commands.set(commands.map(command => command.data));
        console.log(`Successfully reloaded ${commands.length} GUILD (/) commands.`);
    } catch (error) {
        console.error(error);
    }
});

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const { commandName } = interaction;
	const command = commands.find(command => command.data.name === commandName); // nodemon GO you stupid mf

	if (!command) return;

	try {
		// console.log(command)
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

client.login(TOKEN);