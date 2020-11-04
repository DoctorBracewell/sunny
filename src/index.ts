// Imports
import { discord } from "./json/tokens.json";
import {readdir} from "fs";

// Discord.js Setup
import * as Discord from "discord.js";
import { Command } from "discord.js";
const discordClient = new Discord.Client();

// Attach events
readdir(__dirname + "/events/", (err, files) => {
  if (err) return console.error(err);

  files.forEach(file => {
    // Check for only js files
    if (!(file.endsWith(".js"))) return;

    // Require file
    const event = require(`${__dirname}/events/${file}`);

    // Event name
    let eventName = file.split(".")[0];

    discordClient.on(eventName, event.bind(null, discordClient));
    delete require.cache[require.resolve(`${__dirname}/events/${file}`)];

  });
});

// Commands collection
discordClient.commands = new Discord.Collection();

// Attach commands
readdir(__dirname + "/commands/", (err, files) => {
  if (err) return console.error(err);

  files.forEach(file => {
    if (!(file.endsWith(".js"))) return;

    let props: Command = require(`${__dirname}/commands/${file}`);
    let commandName = file.split(".")[0];

    discordClient.commands.set(commandName, props);

  });
});


// Login
discordClient.login(discord);
