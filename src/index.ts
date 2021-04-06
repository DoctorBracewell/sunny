// Imports
import { discord } from "./json/tokens.json";
import { readdir } from "fs";
import { Command } from "./command";

// Discord.js Setup
import { Client, Collection } from "discord.js";
const discordClient = new Client();

// Attach events
readdir(__dirname + "/events/", (err, files) => {
  if (err) return console.error(err);

  files
    .filter((file) => file.endsWith(".js"))
    .forEach(async (file) => {
      // Check for only js files
      if (!file.endsWith(".js")) return;

      // Require file
      const event = await import(`${__dirname}/events/${file}`);

      // Event name
      let eventName = file.split(".")[0];

      discordClient.on(eventName, event.main.bind(null, discordClient));
    });
});

// Commands collection
export const commandsCollection: Collection<string, Command> = new Collection();

// Attach commands
readdir(__dirname + "/commands/", (err, files) => {
  if (err) return console.error(err);

  files
    .filter((file) => file.endsWith(".js"))
    .forEach(async (file) => {
      // Save module in command collection
      let commandModule: Command = await import(
        `${__dirname}/commands/${file}`
      );

      commandsCollection.set(commandModule.data.name, commandModule);
    });
});

// Login
discordClient.login(discord);
