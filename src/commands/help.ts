// Imports
import { SunnyEmbed, capitaliseFirstLetter } from "utils";

// Node Modules
import { promises } from "fs";
import { FILE_EXTENSION } from "@constants";

export const data: CommandData = {
  name: "help",
  category: "utility",
  description: "Provides this message.",
  args: [],
};
class CommandTag {
  name: string;
  args: CommandArgument[];
  description: string;

  constructor(name: string, args: CommandArgument[], description: string) {
    this.name = name;
    this.args = args;
    this.description = description;
  }

  formatTag() {
    // Get data from command module and format to add to embed.
    let formattedTag = "- **$";

    formattedTag += `${this.name}** `;
    //prettier-ignore
    formattedTag += `${
        this.args.length !== 0
          ? this.args
              .map((element) =>
                `[${element.options
                  .map((option) => option.example)
                  .join("/")}]`
              )
              .join(" ")
          : ""
      } **➤** `;
    formattedTag += `${this.description}`;

    return formattedTag;
  }
}

class HelpSection {
  name: string;
  commands: CommandTag[];

  constructor(name) {
    this.name = name;
    this.commands = new Array();
  }

  appendToEmbed(helpEmbed) {
    // Add to embed
    return helpEmbed.addField(
      `__${capitaliseFirstLetter(this.name)}__`,
      `\n${this.commands.map((command) => command.formatTag()).join("\n")}\n`
    );
  }

  // Add new command
  addCommand({ name, args, description }: CommandData) {
    this.commands.push(new CommandTag(name, args, description));
  }
}

export async function execute({ message }: CommandParameters) {
  // Initialise embed
  let help = new SunnyEmbed()
    .setDefaultProperties()
    .setTitle("**Hello!**")
    .setDescription(
      "I am Sunny, a custom discord bot coded by DrBracewell. Check below for some commands you can use."
    );

  // Read command modules
  const files = await promises.readdir(__dirname);
  // Add file data from all command modules to map
  let helpSections: Map<string, HelpSection> = new Map();

  for await (const file of files.filter((file) =>
    file.endsWith(FILE_EXTENSION)
  )) {
    // Require module
    const commandModule: Command = await import(`./${file}`);

    // Create category if it doesnt exist
    if (!helpSections.has(commandModule.data.category))
      helpSections.set(
        commandModule.data.category,
        new HelpSection(commandModule.data.category)
      );

    // Add command data to section.
    helpSections
      .get(commandModule.data.category)
      .addCommand(commandModule.data);
  }

  // Spread help sections and sort, then add to embed.
  new Map([...helpSections].sort()).forEach((section) => {
    help = section.appendToEmbed(help);
  });

  // Add final field and send embed
  help.addField(
    "\u200B",
    "You can also just try chatting to me normally, though sometimes I won't have the best responses, sorry!\n"
  );
  message.reply(help);
}
