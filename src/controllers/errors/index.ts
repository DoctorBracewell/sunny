// Imports
import { SunnyEmbed, tagDrBracewell } from "utils";

// Node Modules
import { TextChannel } from "discord.js";

export enum ErrorTypes {
  InvalidCommand = "Invalid Command",
  InvalidArguments = "Invalid Argument",
  InvalidLanguage = "Invalid Language",
}

/**
 * Convert an Error from a command module to a BotError, otherwise leave as UserError
 */
export function errorConvert(error): UserError | BotError {
  return error instanceof Error ? new BotError(error) : error;
}

export class BotError {
  error: Error;

  constructor(error) {
    this.error = error;
    console.error(error);
  }

  async send(channel: TextChannel) {
    const errorEmbed = new SunnyEmbed()
      .setDefaultFooter()
      .setColor("#ff0033")
      .setTitle("Oops, something went wrong!")
      .setDescription(`Perhaps Brace could fix it?`)
      .addField("Error", this.error.message);

    await channel.send(errorEmbed);
    await channel.send(tagDrBracewell());
  }
}

export class UserError {
  message: string;

  constructor(errorType: ErrorTypes, customMessage = "Try again?") {
    this.message = `${errorType}: ${customMessage}`;
  }

  async send(channel) {
    channel.send(this.message);
  }
}
