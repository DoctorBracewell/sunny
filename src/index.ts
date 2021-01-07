// Imports
import { discord } from "./json/tokens.json";
import {readdir} from "fs";

// Discord.js Setup
import { Client, Collection } from "discord.js";
import { Command } from "discord.js";
const discordClient = new Client();

// Attach events
readdir(__dirname + "/events/", (err, files) => {
  if (err) return console.error(err);

  files.forEach(async file => {
    // Check for only js files
    if (!(file.endsWith(".js"))) return;

    // Require file
    const event = await import(`${__dirname}/events/${file}`);

    // Event name
    let eventName = file.split(".")[0];

    discordClient.on(eventName, event.main.bind(null, discordClient));
  });
});

// Commands collection
discordClient.commands = new Collection();

// Attach commands
readdir(__dirname + "/commands/", (err, files) => {
  if (err) return console.error(err);

  files.forEach(async file => {
    if (!(file.endsWith(".js"))) return;

    let props: Command = (await import(`${__dirname}/commands/${file}`)).command;
    let commandName = file.split(".")[0];

    discordClient.commands.set(commandName, props);

  });
});

// Login
discordClient.login(discord);
