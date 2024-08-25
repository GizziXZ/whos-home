const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Get the bot\'s ping!'),
    async execute(interaction) {
        await interaction.reply(`client.ws ping: \`${interaction.client.ws.ping}ms\`\nAPI Latency: \`${interaction.createdTimestamp - Date.now()}ms\``);
    },
}