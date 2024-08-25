const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const os = require('os');
const find = require('local-devices');
const { toVendor } = require('@network-utils/vendor-lookup'); // finally a good npm package for this
const localStorage = require('node-persist');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clients')
        .setDescription('Get a list of the wifi clients'),
    async execute(interaction) {
        await interaction.deferReply();
        await localStorage.init();
        const trusted = await localStorage.keys();
        find().then(async devices => {
            const wifi = os.networkInterfaces().wlan0?.[0] || os.networkInterfaces().WiFi?.[1];
            // console.log(wifi);
            const embed = new EmbedBuilder()
                .setTitle('Current local ip: ' + wifi.address)
                .setDescription('Here are the wifi clients connected to the network')
                .setColor('#0099ff')
                .setTimestamp()
                .setFooter({text: 'Wifi clients', iconURL: 'https://i.imgur.com/wSTFkRM.png'});
                for (const device of devices) {
                    const isTrusted = trusted.includes(device.mac);
                    const displayName = isTrusted ? `${device.ip} (trusted)` : device.ip;
                    embed.addFields({ name: displayName, value: `${device.mac} (${toVendor(device.mac)})` });
                }
            interaction.editReply({ embeds: [embed] });
        })
    },
}