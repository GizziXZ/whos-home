const { SlashCommandBuilder } = require('discord.js');
const localStorage = require('node-persist');
const { toVendor } = require('@network-utils/vendor-lookup');
const dns = require('dns');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('wifi-notif')
        .setDescription('Get notified when a new device connects to the wifi')
        .addBooleanOption(option => option.setName('enable').setDescription('Enable or disable wifi notifications'))
        .addChannelOption(option => option.setName('channel').setDescription('The channel to send the notifications to'))
        .addBooleanOption(option => option.setName('notify-all').setDescription('Notify for all devices connected to the wifi, including trusted devices')),
    async execute(interaction) {
        await localStorage.init();
        const channel = interaction.options.getChannel('channel');
        if (channel) localStorage.setItem('channel', channel.id);
        const enabled = interaction.options.getBoolean('enable');
        const notifyAll = interaction.options.getBoolean('notify-all');

        if (!channel && !enabled && !notifyAll) {
            const channel = await localStorage.getItem('channel');
            const enabled = await localStorage.getItem('wifi-notif');
            const notifyAll = await localStorage.getItem('notify-all');
            startMonitoring(interaction.client);
            return await interaction.reply(`Wifi notifications are ${enabled ? 'enabled' : 'disabled'}, and will ${notifyAll ? 'notify for all devices' : 'only notify for new devices'} at ${channel ? `<#${channel}>` : 'the default channel'}`);
        }
        if (channel) {
            await localStorage.setItem('channel', channel.id);
        }
        if (enabled) {
            await localStorage.setItem('wifi-notif', true);
        } else {
            await localStorage.setItem('wifi-notif', false);
        }
        if (notifyAll) {
            await localStorage.setItem('notify-all', true);
        } else {
            await localStorage.setItem('notify-all', false);
        }
        await interaction.reply(`Wifi notifications are now ${enabled ? 'enabled' : 'disabled'}, and will now ${notifyAll ? 'notify for all devices' : 'only notify for new devices'} at ${channel ? `<#${channel.id}>` : 'the default channel'}`);
        if (await localStorage.getItem('wifi-notif')) {
            console.log('Starting wifi monitoring...');
            startMonitoring(interaction.client);
        }
    },
}

async function startMonitoring(client) {
    await localStorage.init();
    const find = require('local-devices');
    const channel = client.channels.cache.get(await localStorage.getItem('channel'));
    const notifyAll = await localStorage.getItem('notify-all');
    if (!channel) return console.log('No channel set!'); // No channel, no monitor :(
    let previousDevices = await find();

    setInterval(async () => {
        const currentDevices = await find();
        const trusted = await localStorage.keys();

        const newDevices = currentDevices.filter(device => 
            !previousDevices.some(prevDevice => prevDevice.mac === device.mac)
        );

        for (const device of newDevices) {
            if (!device) return;
            const isTrusted = trusted.includes(device.mac);
            let hostname = dns.reverse(currentDevices.ip, (err, hostnames) => {
                if (err) return reject(err);
                resolve(hostnames);
            });
            if (notifyAll || !isTrusted) {
                // console.log(`New device connected: ${device.ip} (${device.mac} - ${toVendor(device.mac)})`);
                const { EmbedBuilder } = require('discord.js');
                const embed = new EmbedBuilder()
                    .setTitle('New device connected')
                    // .setDescription(`${device.ip} (${device.mac})`)
                    // .setColor('#0099ff') // changing this to red/green depending on whether trusted or not
                    // .setFooter({ text: 'Wifi notifications', iconURL: 'https://i.imgur.com/wSTFkRM.png' })
                    .setTimestamp()
                    .setAuthor({ name: hostname || 'Unknown' })
                    .setDescription(`${device.ip} (${device.mac} - ${toVendor(device.mac)})`);
                if (isTrusted) {
                    embed.setColor('Green');
                    embed.setFooter({ text: 'Trusted', iconURL: 'https://i.imgur.com/wSTFkRM.png' });
                } else {
                    embed.setColor('Red');
                    embed.setDescription(`${device.ip} (${device.mac} - ${toVendor(device.mac)})`);
                    embed.setFooter({ text: 'Untrusted', iconURL: 'https://i.imgur.com/wSTFkRM.png' });
                }
                // channel.send({ embeds: [embed] });
                channel.send('a');
            }
        }

        previousDevices = currentDevices;
        await localStorage.setItem('previousDevices', currentDevices);
    }, 5000); // Scan interval
}