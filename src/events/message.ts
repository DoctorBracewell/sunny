// Imports
import { randomReactions } from "@controllers/reactions";
import { parseArguments } from "@controllers/arguments";
import { commandsCollection } from "../index";
import { CTCODING, MANSION, PREFIX, DEVELOPMENT } from "@constants";
import { servers } from "@config";
import { main as runDialogflowRequest } from "@controllers/dialogflow";
import { Roll } from "@controllers/dice";

// Node modules
import { Client, Message, TextChannel } from "discord.js";
import {
  BotError,
  errorConvert,
  ErrorTypes,
  UserError,
} from "@controllers/errors";

export async function main(client: Client, message: Message) {
  const channel = message.channel as TextChannel;

  randomReactions(message);

  // Return statements
  if (message.author.bot) return;
  if (message.content.startsWith("//")) return;

  // Roll and return
  if (message.content.startsWith("/r")) {
    return new Roll(message);
  }

  // TODO: Revamp channel checking
  // Check Channels
  let validChannels = [];
  if (
    ["$openscene", "$closescene"].some((command) =>
      message.content.includes(command)
    ) &&
    message.guild.id === (DEVELOPMENT ? servers.test.id : MANSION.id)
  ) {
    let role = message.guild.roles.cache.find(
      (role) => role.name === "Open Scene Channels"
    );

    if (channel?.parent?.permissionsFor(role)?.has("MANAGE_MESSAGES")) {
      validChannels.push(channel.id);
    } else {
      message.reply("This channel cannot be marked as an open scene!");
    }
  } else if (DEVELOPMENT) {
    validChannels.push(servers.test.channels.bot);
  } else {
    validChannels = Object.values(servers).map((e) => e.channels.bot);
  }

  if (!validChannels.includes(channel.id)) return;

  // Command handler

  if (message.content.startsWith(PREFIX)) {
    // Split message by whitespace
    const messageSections = message.content
      .toLowerCase()
      .slice(PREFIX.length)
      .split(/ +/);

    // Remove and save command word from messageSections
    const commandString = messageSections.shift();

    // Import command module
    const cmd = commandsCollection.get(commandString);

    // Parse arguments
    let args;
    try {
      args = await parseArguments(cmd.data.args, messageSections);
    } catch (error) {
      return errorConvert(error).send(channel);
    }

    // 404 command not found
    if (!cmd)
      message.channel.send(
        new UserError(
          ErrorTypes.InvalidCommand,
          "Use `$help$ to see all available commands."
        ).message
      );

    // Execute command
    try {
      await cmd.execute({ client, message, args });
    } catch (error) {
      errorConvert(error).send(channel);
    }

    return;
  }

  // Dialogflow and final check for coding server
  if (channel.id === CTCODING.channels.bot) return;

  try {
    runDialogflowRequest(message);
  } catch (error) {
    new BotError(error).send(channel);
  }
}
