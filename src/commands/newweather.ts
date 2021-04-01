import { Client, Message } from "discord.js";
import weather from "../controllers/weather";
import { MOD_ROLE } from "../constants";

export const command = {
  name: "newweather",
  category: "utility",
  description: "For mod use only, creates a new weather report in the channel.",
  arguments: "",
  execute(client: Client, message: Message, args: string[]) {
    if (
      !message.guild
        .member(message.author)
        .roles.cache.find((role) => role.name === MOD_ROLE)
    )
      return;

    weather(client, false);

    message.delete();
  },
};
