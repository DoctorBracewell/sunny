import { Client, Message } from "discord.js";
import { Argument } from "./controllers/arguments";

export interface CommandArguments {
  client: Client;
  message: Message;
  args: string[];
}

export interface CommandData {
  name: string;
  category: string;
  description: string;
  args: Argument[];
}

export interface Command {
  data: CommandData;
  execute(args: CommandArguments);
}
