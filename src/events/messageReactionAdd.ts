// Imports
import { MANSION, DEVELOPMENT, TEST } from "@constants";

// Node Modules
import { Client, MessageReaction, User } from "discord.js";

export async function main(
  client: Client,
  reaction: MessageReaction,
  author: User
) {
  // Constants
  const message = reaction.message;
  const emoji = reaction.emoji;

  // Return cases
  if (message.guild.id !== (DEVELOPMENT ? TEST.id : MANSION.id)) return;
  if (message.channel.id !== MANSION.channels.rules) return;

  // Fetch member
  const member = await message.guild.members.fetch(author.id);
  // Valid Emojis
  const validEmojis = ["💬", "📝"];

  // If emoji valid
  if (validEmojis.includes(emoji.name)) {
    // Blocked channels always removed
    member.roles.remove(
      member.guild.roles.cache.find((role) => role.name == "Blocked Channels")
    );
    // Chatting always added
    member.roles.add(
      member.guild.roles.cache.find((role) => role.name == "Chatting Channels")
    );

    // Add roleplay
    if (emoji.name === validEmojis[1])
      member.roles.add(
        member.guild.roles.cache.find(
          (role) => role.name == "Roleplay Channels"
        )
      );
  }

  // Remember to remove
  reaction.remove();
}
