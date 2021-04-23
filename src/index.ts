// Imports
import { FILE_EXTENSION, MONGO_PASSWORD } from "@constants";
import { discord } from "@json/tokens.json";

// Node Modules
import { Client, Collection } from "discord.js";
import { readdir } from "fs";

// Discord.js Setup
const discordClient = new Client();

// Google Credentials (for dialogflow)
process.env.GOOGLE_APPLICATION_CREDENTIALS = `${__dirname}/../sunny-auth.json`;

// Attach events
readdir(__dirname + "/events/", (err, files) => {
  if (err) return console.error(err);

  files
    .filter((file) => file.endsWith(FILE_EXTENSION))
    .forEach(async (file) => {
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
    .filter((file) => file.endsWith(FILE_EXTENSION))
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
