const { SlashCommandBuilder } = require('discord.js');
const localStorage = require('node-persist');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('trust')
        .setDescription('Add a Mac address to the trusted list')
        .addStringOption(option => option.setName('mac').setDescription('The Mac address to trust').setRequired(true)),
    async execute(interaction) {
        const mac = interaction.options.getString('mac');
        await localStorage.init();
        await localStorage.setItem(mac, true);
        await interaction.reply(`Trusted \`${mac}\``);
    }
}