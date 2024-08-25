const { SlashCommandBuilder } = require('discord.js');
const { toVendor } = require('@network-utils/vendor-lookup');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('macaddr')
        .setDescription('Get the vendor of a Mac address')
        .addStringOption(option => option.setName('mac').setDescription('The Mac address to lookup').setRequired(true)),
    async execute(interaction) {
        const mac = interaction.options.getString('mac');
        await interaction.reply({content: toVendor(mac),  ephemeral: true });
    }
}