const { SlashCommandBuilder } = require('discord.js');
const localStorage = require('node-persist');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('wifi-notif')
        .setDescription('Get notified when a new device connects to the wifi')
        .addChannelOption(option => option.setName('channel').setDescription('The channel to send the notifications to'))
        .addBooleanOption(option => option.setName('enable').setDescription('Enable or disable wifi notifications'))
        .addBooleanOption(option => option.setName('notify-all').setDescription('Notify for all devices connected to the wifi, including trusted devices')),
    async execute(interaction) {
        await localStorage.init();
        const channel = interaction.options.getChannel('channel');
        const enabled = interaction.options.getBoolean('enable');
        const notifyAll = interaction.options.getBoolean('notify-all');

        if (!channel && !enabled && !notifyAll) {
            const enabled = await localStorage.getItem('wifi-notif');
            const notifyAll = await localStorage.getItem('notify-all');
            return await interaction.reply(`Wifi notifications are ${enabled ? 'enabled' : 'disabled'}, and will ${notifyAll ? 'notify for all devices' : 'only notify for new devices'}`);
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
            startMonitoring(await localStorage.getItem('notify-all'));
        }
    },
}

async function startMonitoring(notifyAll) {
    await localStorage.init();
    const find = require('local-devices');
    let previousDevices = await localStorage.getItem('previousDevices') || [];
    const channel = await localStorage.getItem('channel');
    if (!channel) return; // No channel, no monitor :(

    setInterval(async () => {
        const currentDevices = await find();
        const trusted = await localStorage.keys();

        const newDevices = currentDevices.filter(device => 
            !previousDevices.some(prevDevice => prevDevice.mac === device.mac)
        );

        for (const device of newDevices) {
            const isTrusted = trusted.includes(device.mac);
            if (notifyAll || !isTrusted) {
                // console.log(`New device connected: ${device.ip} (${device.mac} - ${toVendor(device.mac)})`);
                const { EmbedBuilder } = require('discord.js');
                const embed = new EmbedBuilder()
                    .setTitle('New device connected')
                    .setDescription(`${device.ip} (${device.mac})`)
                    .setColor('#0099ff') // changing this to red/green depending on whether trusted or not
                    .setTimestamp()
                    .setFooter({ text: 'Wifi notifications', iconURL: 'https://i.imgur.com/wSTFkRM.png' });
            }
        }

        previousDevices = currentDevices;
        await localStorage.setItem('previousDevices', currentDevices);
    }, 60000); // Scan every 60 seconds
}