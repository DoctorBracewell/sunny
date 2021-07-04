import { PREFIX } from "@constants";
import {
  BotError,
  errorConvert,
  ErrorTypes,
  UserError,
} from "@controllers/errors";
import { Client, Message, TextChannel } from "discord.js";
import { commandsCollection } from "index";
import { parseArguments } from "./arguments";
import { validChannel } from "./channels";

export class CommandEvent {
  client: Client;
  message: Message;
  messageSections: string[];
  channel: TextChannel;
  command: Command;
  args: string[];

  constructor(client: Client, message: Message, channel: TextChannel) {
    this.message = message;
    this.channel = channel;
    this.client = client;

    this.handleCommand();
  }

  async handleCommand() {
    if (!validChannel(this.message, this.channel)) return;

    try {
      await this.parseMessageContent();
    } catch (error) {
      return new BotError(error).send(this.channel);
    }

    try {
      await this.importCommandData();
    } catch (error) {
      return error.send(this.channel);
    }

    try {
      await this.parseArguments();
    } catch (error) {
      return errorConvert(error).send(this.channel);
    }

    try {
      await this.executeCommand();
    } catch (error) {
      return errorConvert(error).send(this.channel);
    }
  }

  async parseMessageContent() {
    this.messageSections = this.message.content
      .toLowerCase()
      .slice(PREFIX.length)
      .split(/ +/);
  }

  async importCommandData() {
    this.command = commandsCollection.get(this.messageSections[0]);

    if (!this.command)
      throw new UserError(
        ErrorTypes.InvalidCommand,
        `Use \`${PREFIX}help\` to see all available commands.`
      );
  }

  async parseArguments() {
    this.args = await parseArguments(
      this.command.data.args,
      this.messageSections.slice(1)
    );
  }

  async executeCommand() {
    await this.command.execute({
      client: this.client,
      message: this.message,
      args: this.args,
    });
  }
}
