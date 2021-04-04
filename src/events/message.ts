import { Client, Message, TextChannel } from "discord.js";
import { CTCODING, MANSION, PREFIX, DEVELOPMENT } from "../constants";
import { servers } from "../json/config.json";
import { main as runDialogflowRequest } from "../controllers/dialogflow";
import { UserSchema } from "../commands/toggle";
import { Roll } from "../controllers/dice";

// Node modules
import { randomBetween } from "drbracewell-random-tools";
import { get as getEmojiName } from "emoji-name-map";
import { random as getRandomEmoji } from "emoji-random";
import { model } from "mongoose";
import { parseArguments } from "../controllers/arguments";

const UserModel = model("reactions", UserSchema);

export async function main(client: Client, message: Message) {
  const channel = message.channel as TextChannel;

  // Random reactions (as voted by the server (opt in tho (im not that evil (or am I???)))
  if (randomBetween(0, 100) === 0) {
    // 1/100 chance
    if (
      message.guild.id === MANSION.id &&
      (await UserModel.findOne({ id: message.member.id }))
    ) {
      // number of emojis
      let number = randomBetween(3, 10);

      // for loop
      try {
        for (let i = 0; i < number; i++) {
          // choose emoji
          let emoji = getEmojiName(getRandomEmoji());

          // react (with catch cause discord doesnt have all)
          message.react(emoji).catch((error) => {
            if (error) console.error(error);
          });
        }
      } catch (error) {}
    }
  }

  // yada yada return if these things happen
  if (message.author.bot) return;
  if (message.content.startsWith("//")) return;
  if (message.content.startsWith("/r")) {
    new Roll(message);
    return;
  }

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
    // TODO: Change command modules structure to ES6
    // Split message by whitespace
    const messageSections = message.content
      .toLowerCase()
      .slice(PREFIX.length)
      .split(/ +/);

    // Remove command word from messageSections
    const commandString = messageSections.shift().toLowerCase();

    // Import command
    const cmd = client.commands.get(commandString);

    // Parse arguments
    let args;

    try {
      args = parseArguments(cmd.arguments, messageSections);
    } catch (error) {
      return channel.send(error.message);
    }

    // 404 command not found
    if (!cmd)
      return channel.send(
        "I can't seem to find that command, sorry! Use `$help` to see a list of all commands."
      );

    try {
      cmd.execute(client, message, args);
    } catch (error) {
      console.error(error);
      message.reply("There was an error trying to execute that command!");
    }

    return;
  }

  // Dialogflow
  if (channel.id === CTCODING.channels.bot) return;
  runDialogflowRequest(message);
}
