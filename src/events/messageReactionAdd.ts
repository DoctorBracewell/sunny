import { Client, MessageReaction, User } from "discord.js";
import { MANSION } from "../constants";

module.exports = (client: Client, reaction: MessageReaction, member: User) => {
    // Constants and return if wronh channel
    const message = reaction.message, emoji = reaction.emoji;
    if (message.channel.id != MANSION.channels.rules) return;
    
    // Speaking channels
    if (emoji.name == '💬') {
        message.guild.members.fetch(member.id).then(member => {
            member.roles.add(member.guild.roles.cache.find(role => role.name == "Chatting Channels"))
        });
        message.guild.members.fetch(member.id).then(member => {
            member.roles.add(member.guild.roles.cache.find(role => role.name == "Blocked Channels"))
        });
    }
    
    // Roleplay Channels
    if (emoji.name == '📝') {
        message.guild.members.fetch(member.id).then(member => {
            member.roles.add(member.guild.roles.cache.find(role => role.name == "Chatting Channels"))
            member.roles.add(member.guild.roles.cache.find(role => role.name == "Roleplay Channels"))
        });
        message.guild.members.fetch(member.id).then(member => {
            member.roles.remove(member.guild.roles.cache.find(role => role.name == "Blocked Channels"))
        });
    }
    
    // Remember to remove
    reaction.remove();
};

