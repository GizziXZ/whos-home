const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('history')
        .setDescription('Get saved history of Wifi connections')
        .addIntegerOption(option => option.setName('lines').setDescription('The number of lines to get'))
        .addBooleanOption(option => option.setName('oldest').setDescription('Get the oldest entries instead of the newest')),
    async execute(interaction) {
        if (!fs.existsSync('./history.log')) {
            return await interaction.reply('No history found');
        }
        const history = fs.readFileSync('./history.log', 'utf8');
        let lines = interaction.options.getInteger('lines') || 10;
        const oldest = interaction.options.getBoolean('oldest');
        const historyArray = history.split('\n');
        if (oldest) {
            return await interaction.reply(`Oldest ${lines} entries:\n\`\`\`${historyArray.slice(0, lines).join('\n')}\`\`\``);
        }
        if (lines === 1) lines++; // because it doesn't work properly otherwise but whatever
        return await interaction.reply(`Newest ${lines} entries:\n\`\`\`${historyArray.slice(-lines).join('\n')}\`\`\``);
    }
}