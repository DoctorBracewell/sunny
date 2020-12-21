import { Client, GuildMember, TextChannel } from "discord.js";
import { MANSION } from "../constants";

export function main(client: Client, member: GuildMember) {
    if (member.user.bot || member.guild.id !== MANSION.id) return; 
  
    // Add blocked channels
    member.roles.add(member.guild.roles.cache.find(role => role.name == "Blocked Channels"));
  
    // send message
    const greetingChannel: TextChannel = client.guilds.cache.get(MANSION.id).channels.cache.get(MANSION.channels.greeting) as TextChannel;
    greetingChannel.send(`Hello ${member.user}! Welcome to the Ace Mansion! Please head on over to <#612813188077191199> to learn our server-wide rules (and <#686239449646235662> if you're planning on role-playing). Make sure to read the rules fully to learn how to gain access to chatting and roleplay channels, and then head to <#626067099277852712> for what to do next. Enjoy your stay!`);
};

