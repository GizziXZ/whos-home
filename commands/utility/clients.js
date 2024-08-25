const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const os = require('os');
const find = require('local-devices');
const { toVendor } = require('@network-utils/vendor-lookup'); // finally a good npm package for this

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clients')
        .setDescription('Get a list of the wifi clients'),
    async execute(interaction) {
        find().then(devices => {
            const wifi = os.networkInterfaces().wlan0 || os.networkInterfaces().WiFi[1];
            const embed = new EmbedBuilder()
                .setTitle(wifi.address)
                .setDescription('Here are the wifi clients connected to the network')
                .setColor('#0099ff')
                .setTimestamp()
                .setFooter({text: 'Wifi clients', iconURL: 'https://i.imgur.com/wSTFkRM.png'});
            devices.forEach(device => {
                embed.addFields({name: `${device.ip} (${device.name})`, value: `${device.mac} (${toVendor(device.mac)})`});
            });
            interaction.reply({ embeds: [embed] });
        })
    },
}