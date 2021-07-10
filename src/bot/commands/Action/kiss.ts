/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import Command from '../../struct/Command';
import { Message, MessageEmbed } from 'discord.js';
import axios from 'axios';

abstract class KissCommand extends Command {
    constructor() {
        super({
            name: 'kiss',
            aliases: [],
            description: 'Kiss ur friends the discord way : ) [NSFW should be reported immediately and the command should be be disabled]',
            usage: '<prefix>kiss [person]',
            category: 'Action',
            cooldown: 0,
            ownerOnly: false,
            guildOnly: false,
            requiredArgs: 0,
            userPermissions: [],
            clientPermissions: []
        });
    }
    public async exec(message: Message, args: string[]) {
        try {
            let target = message.mentions.members?.first() || args[0];
            if (!args[0]) target = '**air...**'
            const {
                data: {
                    url
                }
            } = await axios.get(`https://waifu.pics/api/sfw/kiss`)
            const embed = new MessageEmbed().setImage(`${url}`).setDescription(`Aww!! ${message.author} kissed ${target}`).setColor(`#FFC0CB`)
            message.reply({ embeds: [embed] })        } catch (e) {
            return this.client.logs(message, e, "error")
        }
    }
}
export default KissCommand;
