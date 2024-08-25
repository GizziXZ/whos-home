// holy moly crystal castles reference?!?!
const { SlashCommandBuilder } = require('discord.js');
const { toVendor } = require('@network-utils/vendor-lookup');
const localStorage = require('node-persist');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('untrust')
        .setDescription('Remove a Mac address from the trusted list')
        .addStringOption(option => option.setName('mac').setDescription('The Mac address to untrust').setRequired(true)),
    async execute(interaction) {
        const mac = interaction.options.getString('mac');
        await localStorage.init();
        if (!await localStorage.getItem(mac)) return await interaction.reply(`\`${mac}\` is not trusted`);
        await localStorage.removeItem(mac);
        await interaction.reply(`Untrusted \`${mac} (${toVendor(mac)})\``);
    }
}