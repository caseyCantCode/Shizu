/* eslint-disable no-useless-escape */
/* eslint-disable no-empty */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import Command from "../../struct/Command";
import { Message, TextChannel } from "discord.js";
import { modlogs as schema } from "../../mongoose/schemas/modlogs";

abstract class ModLogsCommand extends Command {
  constructor() {
    super({
      name: "set-modlogs",
      aliases: [],
      description: "Set a channel for the mod logs",
      usage: "<prefix>set-modlogs <set-channel>",
      category: "mods",
      cooldown: 0,
      ownerOnly: false,
      guildOnly: true,
      requiredArgs: 1,
      userPermissions: ["MANAGE_GUILD"],
      clientPermissions: ["MANAGE_WEBHOOKS"],
    });
  }

  public async exec(message: Message, args: string[]) {
    const Data = await schema.findOne({
      guildId: String(message.guild?.id),
    });
    if (!Data) {
      const cid =
        message.mentions.channels.first() ??
        message.guild?.channels.cache.get(`${BigInt(args[0])}`);
      if (!cid) {
        return message.reply(
          `Could\'nt find a channel! Please provide a valid Id`
        );
      }
      if (!(cid instanceof TextChannel)) {
        return message.reply(
          `This is not a valid channel tagged, Make sure this this is a text channel`
        );
      }
      await new schema({
        guildId: String(message.guild?.id),
        channelId: cid.id,
      }).save();
      this.client.cache.modlogscache.set(`${message.guild?.id}`, cid.id);
      if (cid instanceof TextChannel)
        await cid.createWebhook("Shizu Logger", {
          avatar: `${this.client.user.displayAvatarURL()}`,
          reason: "Needed a Mod Logger",
        });
      message.reply({
        content: `Mod Logs channel set to ${cid}`,
      });
    } else {
      await schema.findOneAndRemove({
        guildId: String(message.guild?.id),
      });
      this.client.cache.modlogscache.delete(`${message.guild?.id}`);
      message.channel.send({
        content: `**Successfuly Reset the Mod Logs System on your Server!**\npls use this command again to re-setup!`,
      });
    }
  }
}
export default ModLogsCommand;
