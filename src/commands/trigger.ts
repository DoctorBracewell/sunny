// Imports
import { MOD_ROLE } from "@constants";

export const data: CommandData = {
  name: "trigger",
  category: "utility",
  description: "For mod use only, triggers certain custom-coded events.",
  args: [],
};

export async function execute({ message }: CommandParameters) {
  if (
    !message.guild
      .member(message.author)
      .roles.cache.find((role) => role.name === MOD_ROLE)
  )
    return message.reply("this trigger can only be run by a moderator!");

  /* Add roles for everyone
      client.guilds.cache.get("612778224887267342").members.cache.forEach(async member => {
          if (member.roles.cache.find(role => role.name === "Blocked Channels")) return;
          if (member.user.bot) return;

          await member.roles.add(member.guild.roles.cache.get("811941488497786932"));
          await member.roles.add(member.guild.roles.cache.get("811942321855266906"));
          await member.roles.add(member.guild.roles.cache.get("811951005667295243"));

          console.log(`Added roles for: ${member.user.name}`);
      })*/
}
