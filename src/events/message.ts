// Imports
import { randomReactions } from "@controllers/reactions";
import { CommandEvent } from "@controllers/commands";
import { TEST, MANSION, PREFIX } from "@constants";
import { OpenAiSession } from "@controllers/openai";
import { Roll } from "@controllers/dice";

// Node modules
import { Client, Message, TextChannel } from "discord.js";
import { BotError } from "@controllers/errors";

const openAiSession = new OpenAiSession();

export async function main(client: Client, message: Message) {
  if (message.author.bot) return;

  const channel = message.channel as TextChannel;
  randomReactions(message);

  if (message.content.startsWith("//")) return;
  if (message.content.startsWith("/r")) return new Roll(message);
  if (message.content.startsWith(PREFIX))
    return new CommandEvent(client, message, channel);

  // Dialogflow and final check for coding server
  if (![MANSION.channels.bot, TEST.channels.bot].includes(message.channel.id))
    return;

  try {
    openAiSession.recieveMessage(message);
  } catch (error) {
    new BotError(error).send(channel);
  }
}
