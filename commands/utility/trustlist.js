const { SlashCommandBuilder } = require('discord.js');
const localStorage = require('node-persist');
const { toVendor } = require('@network-utils/vendor-lookup');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('trustlist')
        .setDescription('Get a list of the trusted Mac addresses'),
    async execute(interaction) {
        await localStorage.init();
        const trusted = await localStorage.keys();
        if (trusted.length === 0) return await interaction.reply('No Mac addresses are trusted');
        const trustedWithVendor = trusted.map(mac => `${mac} (${toVendor(mac)})`);
        // await interaction.reply(`Trusted Mac addresses: \`${trusted.join(`\`, \``)}\``);
        await interaction.reply(`Trusted Mac addresses: \`${trustedWithVendor.join(`\`, \``)}\``);
    }
}