import { DEVELOPMENT, PREFIX } from "@constants";
import { Message, TextChannel } from "discord.js";
import { servers } from "@config";
import { ErrorTypes, UserError } from "@controllers/errors";

export function validChannel(message: Message, channel: TextChannel) {
  // Development only works in test server
  if (DEVELOPMENT) {
    if (message.guild.id !== servers.test.id) return false;
  }

  // Openscenes only work in right channels
  if (message.content.match(new RegExp(`\\${PREFIX}(open)|(close)scene`))) {
    let role = message.guild.roles.cache.find(
      (role) => role.name === "Open Scene Channels"
    );

    if (!channel?.parent?.permissionsFor(role)?.has("MANAGE_MESSAGES")) {
      new UserError(
        ErrorTypes.InvalidChannel,
        "This channel cannot be marked as an open scene!"
      ).send(channel);

      return false;
    } else {
      return true;
    }
  }

  // Other than that check for bot channels
  if (
    Object.values(servers)
      .map((e) => e.channels.bot)
      .includes(channel.id)
  )
    return true;

  return false;
}
