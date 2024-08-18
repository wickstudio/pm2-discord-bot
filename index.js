const { Client, GatewayIntentBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require('discord.js');
const pm2 = require('pm2');
const path = require('path');
const config = require('./config');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
    console.log(`Code by Wick Studio`);
    console.log(`discord.gg/wicks`);
});

client.on('messageCreate', async (message) => {
    try {
        if (!message.content.startsWith(config.prefix) || message.author.bot) return;

        if (!config.allowedUsers.includes(message.author.id)) {
            return message.channel.send('You do not have permission to use this bot.');
        }

        const args = message.content.slice(config.prefix.length).trim().split(/ +/);
        const command = args.shift().toLowerCase();

        const generateEmbed = (list, page) => {
            const embed = new EmbedBuilder()
                .setColor('#2047D0')
                .setTitle('PM2 Processes')
                .setDescription(`List of currently running PM2 processes (Page ${page + 1}/${Math.ceil(list.length / config.pageSize)})`);

            const start = page * config.pageSize;
            const end = start + config.pageSize;
            const processes = list.slice(start, end);

            processes.forEach((proc) => {
                const folderName = path.basename(proc.pm2_env.pm_cwd);
                const uptimeTimestamp = Math.floor(proc.pm2_env.pm_uptime / 1000);

                embed.addFields(
                    { 
                        name: `ID: ${proc.pm_id}`, 
                        value: `**Name:** ${proc.name}\n**Status:** ${proc.pm2_env.status}\n**Folder:** ${folderName}\n**Uptime:** <t:${uptimeTimestamp}:R>`, 
                        inline: true 
                    }
                );
            });

            return embed;
        };

        if (command === 'list') {
            pm2.list((err, list) => {
                if (err) {
                    console.error('Error listing PM2 processes:', err);
                    return message.channel.send('Failed to list PM2 processes.');
                }

                let page = 0;

                const row = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('prev')
                            .setLabel('Prev')
                            .setStyle(ButtonStyle.Primary)
                            .setDisabled(page === 0),
                        new ButtonBuilder()
                            .setCustomId('next')
                            .setLabel('Next')
                            .setStyle(ButtonStyle.Primary)
                            .setDisabled(page >= Math.ceil(list.length / config.pageSize) - 1)
                    );

                message.channel.send({ embeds: [generateEmbed(list, page)], components: [row] }).then(sentMessage => {
                    const filter = i => i.customId === 'prev' || i.customId === 'next';
                    const collector = sentMessage.createMessageComponentCollector({ filter, componentType: ComponentType.Button, time: 60000 });

                    collector.on('collect', i => {
                        try {
                            if (i.customId === 'prev') {
                                page--;
                            } else if (i.customId === 'next') {
                                page++;
                            }

                            const updatedRow = new ActionRowBuilder()
                                .addComponents(
                                    new ButtonBuilder()
                                        .setCustomId('prev')
                                        .setLabel('Prev')
                                        .setStyle(ButtonStyle.Primary)
                                        .setDisabled(page === 0),
                                    new ButtonBuilder()
                                        .setCustomId('next')
                                        .setLabel('Next')
                                        .setStyle(ButtonStyle.Primary)
                                        .setDisabled(page >= Math.ceil(list.length / config.pageSize) - 1)
                                );

                            i.update({ embeds: [generateEmbed(list, page)], components: [updatedRow] });
                        } catch (error) {
                            console.error('Error during pagination :', error);
                            i.update({ content: 'An error happened while navigating pages.', components: [] });
                        }
                    });

                    collector.on('end', () => {
                        const disabledRow = new ActionRowBuilder()
                            .addComponents(
                                new ButtonBuilder()
                                    .setCustomId('prev')
                                    .setLabel('Prev')
                                    .setStyle(ButtonStyle.Primary)
                                    .setDisabled(true),
                                new ButtonBuilder()
                                    .setCustomId('next')
                                    .setLabel('Next')
                                    .setStyle(ButtonStyle.Primary)
                                    .setDisabled(true)
                            );
                        sentMessage.edit({ components: [disabledRow] }).catch(err => console.error('Error disabling buttons:', err));
                    });
                }).catch(err => {
                    console.error('Error sending initial embed message:', err);
                    message.channel.send('Failed to display PM2 processes.');
                });
            });
        } else if (['start', 'stop', 'restart'].includes(command)) {
            if (args.length === 0) {
                return message.channel.send(`Please provide the ID of the process to ${command}.`);
            }

            const processId = args[0].toLowerCase();

            if (processId === 'all' && command === 'restart') {
                pm2.restart('all', (err) => {
                    if (err) {
                        console.error('Error restarting all processes :', err);
                        return message.channel.send('Failed to restart all processes.');
                    }
                    const embed = new EmbedBuilder()
                        .setColor('#00ff00')
                        .setTitle('PM2 Restart')
                        .setDescription('Successfully restarted all PM2 processes.');

                    message.channel.send({ embeds: [embed] });
                });
            } else {
                pm2[command](processId, (err) => {
                    if (err) {
                        console.error(`Error executing ${command} on process ID ${processId}:`, err);
                        return message.channel.send(`Failed to ${command} the process with ID ${processId}.`);
                    }
                    const embed = new EmbedBuilder()
                        .setColor('#00ff00')
                        .setTitle(`PM2 ${command.charAt(0).toUpperCase() + command.slice(1)}`)
                        .setDescription(`Successfully ${command}ed the process with ID ${processId}.`);

                    message.channel.send({ embeds: [embed] });
                });
            }
        }
    } catch (error) {
        console.error('An unexpected error occurred :', error);
        const embed = new EmbedBuilder()
            .setColor('#ff0000')
            .setTitle('Error')
            .setDescription('Error. Please try again later.');
        message.channel.send({ embeds: [embed] });
    }
});

client.login(config.token).catch(err => {
    console.error('Failed to login to Discord :', err);
});
