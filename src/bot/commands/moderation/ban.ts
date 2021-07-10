/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import Command from '../../struct/Command';
import { Message, MessageEmbed, MessageActionRow, MessageButton, MessageComponentInteraction } from 'discord.js';

abstract class BanCommand extends Command {
    constructor() {
        super({
            name: 'ban',
            aliases: [],
            description: 'Ban someone',
            usage: '<prefix>ban <person> [reason]',
            category: 'mods',
            cooldown: 0,
            ownerOnly: false,
            guildOnly: true,
            requiredArgs: 1,
            userPermissions: ['BAN_MEMBERS'],
            clientPermissions: ['BAN_MEMBERS']
        });
    }

    // tslint:disable-next-line: promise-function-async
    public async exec(message: Message, args: string[]) {
        const row = new MessageActionRow()
            .addComponents([
                new MessageButton()
                    .setCustomId('yes_ban')
                    .setLabel('Yes, Do it')
                    .setStyle('SUCCESS')
                    .setEmoji('<a:tick_yes:835437429288468521>'),
                new MessageButton()
                    .setCustomId('no_ban')
                    .setEmoji('<:tick_no:835440115706888195>')
                    .setLabel('No!!! Dont')
                    .setStyle('DANGER')
            ]);
        try {
            const target = message.mentions.members?.first() || await message.guild?.members.cache.get(`${BigInt(args[0])}`)
            if (!target) return message.reply({
                content: `Cannot find the specified user, Pls make sure this is a valid id = ${args[0]}`
            })
            if (
                message.member && message.member.roles?.highest.position <= target.roles.highest.position
            ) {
                if (message.guild?.ownerId !== message.author.id) return message.reply({
                    content: `The targeted Member aka ${target} is your comarade or is higher than you`
                });
            }
            let reason = args.slice(1).join(' ');
            if (!reason) reason = 'triggering the mods'
            if (!target.bannable) return message.reply({
                content: 'Can\'t ban specified member! Make sure I\'m above them in the heirarchy'
            });
            const confirmationEmbed = new MessageEmbed().setColor('RANDOM')
                .setThumbnail(`https://cdn.discordapp.com/attachments/831552576180322305/848846833845141554/294766366044211.png`)
                .setAuthor(message.author.username, message.author.displayAvatarURL({
                    dynamic: true
                }))
                .setTitle(`Are you sure you want to ban ${target.user.tag}?`).setDescription(`${reason}`)
            const mes = await message.reply({
                embeds: [confirmationEmbed],
                allowedMentions: {
                    repliedUser: true
                },
                components: [row]
            });

            const filter = interaction => interaction.customId === 'yes_ban' || interaction.customId === 'no_ban' && interaction.user.id === message.author.id;

            const collector = mes.createMessageComponentCollector({
                filter,
                time: 1000 * 15,
                max: 1
            });
            collector.on('end', async collected => {
                const hello = collected.first() as MessageComponentInteraction;
                if (!hello) {
                    const hell = new MessageEmbed().setTitle('Time limited to 15 sec').setFooter('You did not react to the buttons within the time alloted').setColor('DARK_BUT_NOT_BLACK').setDescription('Please select One of the following buttons with these emojis').addField('The Yes Emoji', '<a:tick_yes:835437429288468521>').addField('The No Emoji', '<:tick_no:835440115706888195>');
                    await mes.edit({
                        components: [],
                        embeds: [hell]
                    });
                    return;

                }
                if (hello.customId === 'yes_ban') {
                    await target.ban({
                        reason: reason
                    });
                    const banEmbed = new MessageEmbed().setColor('RED')
                        .setAuthor(message.author.username, message.author.displayAvatarURL({
                            dynamic: true
                        }))
                        .setTitle(`Banned ${target.user.tag}`).addField(`Reason`, `${reason}`).setTimestamp();
                    await target.send({
                        content: `Ban alert`,
                        embeds: [
                            new MessageEmbed().setTitle('Ban Alert').setColor('RED').addField('Guild Name', `${message.guild?.name}`).addField('Mod who executed', `${message.author.tag}`).addField('Reason', `${reason}`).setTimestamp()
                        ]
                    }).catch(() => {
                        return;
                    });
                    await mes.edit({
                        components: [],
                        embeds: [banEmbed]
                    });
                } else {
                    const cancelEmbed = new MessageEmbed().setColor('GREEN')
                        .setAuthor(message.author.username, message.author.displayAvatarURL({
                            dynamic: true
                        }))
                        .setTitle(`Cancelled banning ${target.user.tag}!`).setDescription(`Escaped **Ban** but the reason for the **ban** select was ${reason}`);
                    await mes.edit({
                        components: [],
                        embeds: [cancelEmbed]
                    });
                }
            });
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (e: any) {
            return this.client.logs(message, e, "error")
        }
    }
}
export default BanCommand;
