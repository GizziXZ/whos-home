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
        const filteredTrusted = trusted.filter(mac => !['notify-all', 'wifi-notif', 'channel'].includes(mac)); // filter out the keys that are not mac addresses
        if (filteredTrusted.length === 0) return await interaction.reply('No Mac addresses are trusted');
        const trustedWithVendor = filteredTrusted.map(mac => `${mac} (${toVendor(mac)})`);
        await interaction.reply(`Trusted Mac addresses:\n* \`${trustedWithVendor.join('\`\n* \`')}\``);
    }
}