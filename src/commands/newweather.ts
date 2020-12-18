import { Client, Message } from "discord.js";
import weather from "../controllers/weather";

module.exports = {
    name: "newweather",
    category: "utilities",
    description: "For mod use only, creates a new weather report in the channel.",
    arguments: "",
    execute(client: Client, message: Message, args: string[]) {
        if (!message.guild.member(message.author).roles.cache.find(role => role.name === "Mod")) return;

        weather(client);

        message.delete();
    }
  }