/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import Command from '../../struct/Command';
import { Message, MessageEmbed } from 'discord.js';
import util from 'minecraft-server-util';

abstract class McServerCommand extends Command {
	constructor() {
		super({
			name: 'minecraft-server',
			aliases: ['minecraft-server-status', 'mcstats'],
			description: 'Get details about a server',
			usage: '<prefix>mcstats <server-ip>',
			category: 'misc',
			cooldown: 0,
			ownerOnly: false,
			guildOnly: true,
			requiredArgs: 1,
			userPermissions: [],
			clientPermissions: []
		});
	}

	public async exec(message: Message, args: string[]) {
		util
			.status(args[0])
			.then(response => {
				const user = message.author;
				const embed = new MessageEmbed()
					.setColor('RANDOM')
					.setDescription(response.description ? String(response.description) : 'No description for this server')
					.setTitle('Server status')
					.addFields([{
						name: 'Server IP',
						value: String(response.host)
					}, {
						name: 'Port',
						value: String(response.port)
					}, {
						name: 'Online Players',
						value: String(response.onlinePlayers)
					}, {
						name: 'Max Players',
						value: String(response.maxPlayers)
					}, {
						name: 'Version',
						value: String(response.version),
					}])
					.addField('Srv Records', String(`${response.srvRecord?.host} = ${response.srvRecord?.port}`))
					.setTimestamp()
					.setFooter(`${user.tag} command successfully executed `);

				message.reply({ embeds: [embed] });
			})
			.catch(async () => {
				const e = new MessageEmbed()
					.setColor('RANDOM')
					.setTitle('Invalid minecraft IP')
					.setDescription('There was an error to find this minecraft server');
				message.channel.send({
					embeds: [e]
				});
			});
	}
}
export default McServerCommand;
