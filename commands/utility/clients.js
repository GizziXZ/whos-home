const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const os = require('os');
const dns = require('dns');
const find = require('local-devices');
const { toVendor } = require('@network-utils/vendor-lookup'); // finally a good npm package for this

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clients')
        .setDescription('Get a list of the wifi clients'),
    async execute(interaction) {
        find().then(async devices => {
            const wifi = os.networkInterfaces().wlan0 || os.networkInterfaces().WiFi[1]; // im likely changing this variable eventually
            const embed = new EmbedBuilder()
                .setTitle(wifi.address)
                .setDescription('Here are the wifi clients connected to the network')
                .setColor('#0099ff')
                .setTimestamp()
                .setFooter({text: 'Wifi clients', iconURL: 'https://i.imgur.com/wSTFkRM.png'});
                for (const device of devices) {
                    try {
                        const hostnames = await new Promise((resolve, reject) => {
                            dns.reverse(device.ip, (err, hostnames) => {
                                if (err) return reject(err);
                                resolve(hostnames);
                            });
                        });
    
                        const hostname = hostnames.length > 0 ? hostnames[0] : 'Unknown';
                        if (device.ip !== hostname) embed.addFields({ name: `${device.ip} (${hostname})`, value: `${device.mac} (${toVendor(device.mac)})` });
                        else embed.addFields({ name: device.ip, value: `${device.mac} (${toVendor(device.mac)})` });
                    } catch (err) {
                        console.error(`Failed to resolve hostname for IP ${device.ip}:`, err);
                        embed.addFields({ name: `${device.ip} (Unknown)`, value: `${device.mac} (${toVendor(device.mac)})` });
                    }
                }
            await interaction.reply({ embeds: [embed] });
        })
    },
}