import { Client, Message, TextChannel } from "discord.js";

class OpenChannel {
    
}

module.exports = {
    name: 'openscene',
    description: "Indicate a roleplay scene is open by putting an emoji in the name.",
    arguments: "",
    execute(client: Client, message: Message, args: string[]) {
        // Return if already open
        const channel = message.channel as TextChannel;
        const openEmoji = "🅾️";
        
        if (channel.name.includes("🅾️")) {
            message.reply("this channel is already marked as an open scene!");
            return;
        }
    }
}