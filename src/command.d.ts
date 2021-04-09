interface CommandArgument {
  options: Array<{
    regex: RegExp;
    example: string;
  }>;
  default: string;
  required: boolean;
}

interface CommandParameters {
  client: import("discord.js").Client;
  message: import("discord.js").Message;
  args: string[];
}

interface CommandData {
  name: string;
  category: string;
  description: string;
  args: CommandArgument[];
}

interface Command {
  data: CommandData;
  execute(args: CommandParameters);
}
