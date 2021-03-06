/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import Command from "../../struct/Command";
import { Message, MessageEmbed, ColorResolvable } from "discord.js";
import { afk } from "../../mongoose/schemas/afk-message";

abstract class AFKCommand extends Command {
  constructor() {
    super({
      name: "afk",
      aliases: [],
      description: "Set Afk message for a guild",
      usage: "<prefix>afk [message]",
      category: "misc",
      cooldown: 3,
      ownerOnly: false,
      guildOnly: true,
      requiredArgs: 0,
      userPermissions: [],
      clientPermissions: [],
    });
  }

  // tslint:disable-next-line: promise-function-async
  public async exec(message: Message, args: string[]) {
    if (message.guild) {
      let afkMessage = args.join(" ");
      const userId = message.author?.id;
      const guildId = message.guild?.id;

      const embed = new MessageEmbed();

      if (!afkMessage) {
        afkMessage = "AFK"; // Define AFK message
      }
      // tslint:disable-next-line: await-promise
      const data = await new afk({
        guildId,
        userId,
        afk: afkMessage,
        timestamp: new Date().getTime(),
        username:
          message.member?.nickname === null
            ? message.author.username
            : message.member?.nickname, // Keep Old Username
      });
      await data.save();

      await message.member
        ?.setNickname(
          `[AFK] ${
            message.member.nickname === null
              ? `${message.author.username}`
              : `${message.member.nickname}`
          }`
        )
        .catch(async () => {
          return;
        }); // In case bot doesnt have perms

      return message.channel.send({
        embeds: [
          embed
            .setColor(message.guild?.me!.displayHexColor as ColorResolvable)
            .setAuthor(
              "Your AFK Message Has Been Set",
              message.author.displayAvatarURL()
            )
            .setDescription(`<a:bounce:831518713333022736> ${afkMessage}`)
            .setTimestamp(),
        ],
      });
    }
  }
}
export default AFKCommand;
