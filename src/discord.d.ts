// Used to set commands and event properties on discord.js Client
declare module "discord.js" {
  export interface Client {
    commands: Collection<unknown, Command>;
  }

  export interface Command {
    name: string;
    category: string;
    description: string;
    arguments: string;
    execute: (client: Client, message: Message, args: string[]) => void;
  }
}
