import { Client, Message, Command } from "discord.js";
import { newReport } from "../controllers/weather";
import { MOD_ROLE } from "../constants";

export const command: Command = {
  name: "newweather",
  category: "utility",
  description: "For mod use only, creates a new weather report in the channel.",
  arguments: [],
  execute(client: Client, message: Message, args: string[]) {
    if (
      !message.guild
        .member(message.author)
        .roles.cache.find((role) => role.name === MOD_ROLE)
    )
      return;

    newReport(client, false);

    message.delete();
  },
};
