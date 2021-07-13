/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import Event from "../../struct/Event";
import { Message, TextChannel, Guild, Collection } from "discord.js";
import settings from "../../settings";
import { getPrefix } from "../../struct/Check";

abstract class MessageEvent extends Event {
  constructor() {
    super({
      name: "messageCreate",
    });
  }

  public async exec(message: Message): Promise<void> {
    // const prefix = message.guild ? getPrefix(message.guild.id) ? getPrefix(message.guild.id) : this.client.defaultprefix : this.client.defaultprefix
    let prefix = message.guild
      ? getPrefix(message.guild.id)
      : this.client.defaultprefix;
    if (!prefix) prefix = this.client.defaultprefix;
    if (!message.content.startsWith(prefix)) return;
    if (message.author.bot) {
      if (message.author.id !== "843489359869116416") return;
    }
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const commandNam: string | undefined = args.shift();
    const commandName = commandNam;
    if (commandName) {
      const command = this.client.commands.get(commandName);
      if (command) {
        if (message.mentions.channels.first()) {
          const ch = message.mentions.channels.first();
          if (
            ch?.type === "GUILD_PRIVATE_THREAD" ||
            ch?.type === "GUILD_NEWS_THREAD" ||
            ch?.type === "GUILD_PUBLIC_THREAD"
          ) {
            message.channel.send(
              `You have mentioned a channel which is a thread`
            );
            return;
          }
        }
        if (
          command.ownerOnly &&
          !settings.BOT_OWNER_ID.includes(message.author.id)
        ) {
          message.channel.send({
            content: "This command can only be used by the owner of the bot.",
          });
          return;
        } else if (command.guildOnly && !(message.guild instanceof Guild)) {
          message.channel.send({
            content: "This command can only be used in a guild.",
          });
          return;
        }
        if (message.channel instanceof TextChannel) {
          const userPermissions = command.userPermissions;
          const clientPermissions = command.clientPermissions;
          // tslint:disable-next-line: new-parens
          const missingPermissions: any[] = [];
          if (userPermissions?.length) {
            // tslint:disable-next-line: prefer-for-of
            for (let i = 0; i < userPermissions.length; i++) {
              const hasPermission = message.member?.permissions.has(
                userPermissions[i]
              );
              if (!hasPermission) {
                missingPermissions.push(userPermissions[i]);
              }
            }
            if (missingPermissions.length) {
              message.channel.send({
                content: String(
                  `Your missing these required permissions: ${missingPermissions.join(
                    ", "
                  )}`
                ),
              });
              return;
            }
          }
          if (clientPermissions?.length) {
            // tslint:disable-next-line: prefer-for-of
            for (let i = 0; i < clientPermissions.length; i++) {
              const hasPermission = message.guild?.me?.permissions.has(
                clientPermissions[i]
              );
              if (!hasPermission) {
                missingPermissions.push(clientPermissions[i]);
              }
            }
            if (missingPermissions.length) {
              message.channel.send({
                content: String(
                  `I\\'m missing these required permissions: ${missingPermissions.join(
                    ", "
                  )}`
                ),
              });
              return;
            }
          }
        }
        if (command.requiredArgs && command.requiredArgs > args.length) {
          message.channel.send({
            content: String(
              `Invalid usage of this command, please refer to \`${prefix}help ${command.name}\``
            ),
          });
          return;
        }
        if (command.cooldown) {
          if (!this.client.cooldowns.has(command.name)) {
            this.client.cooldowns.set(command.name, new Collection());
          }
          const now = Date.now();
          const timestamps = this.client.cooldowns.get(command.name);
          const cooldownAmount = command.cooldown * 1000;
          if (timestamps?.has(message.author.id)) {
            const cooldown = timestamps.get(message.author.id);
            if (cooldown) {
              const expirationTime = cooldown + cooldownAmount;
              if (now < expirationTime) {
                const timeLeft = (expirationTime - now) / 1000;
                message.channel.send({
                  content: String(
                    `Wait ${timeLeft.toFixed(
                      1
                    )} more second(s) before reusing the \`${
                      command.name
                    }\` command.`
                  ),
                });
                return;
              }
            }
          }
          timestamps?.set(message.author.id, now);
          setTimeout(
            () => timestamps?.delete(message.author.id),
            cooldownAmount
          );
        }
        if (command.exec.constructor.name === "AsyncFunction") {
          command.exec(message, args, prefix).catch((err) => {
            console.log(err);
            message.channel.send({
              content: err.message,
            });
          });
          return;
        }
        try {
          command.exec(message, args, prefix);
          return;
        } catch (error) {
          console.log(error);
          message.reply({
            content: "there was an error running this command.",
          });
        }
      }
    }
  }
}

export default MessageEvent;
