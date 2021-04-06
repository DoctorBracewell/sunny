import { readdirSync } from "fs";
import { Client, Message, Command } from "discord.js";
import { SunnyEmbed, capitaliseFirstLetter } from "../utils";
import { Argument } from "../controllers/arguments";

export const command: Command = {
  name: "help",
  category: "utility",
  description: "Provides this message.",
  arguments: [],
  execute(client: Client, message: Message, args: string[]) {
    class CommandTag {
      name: string;
      args: Argument[];
      description: string;

      constructor(name: string, args: Argument[], description: string) {
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

      appendToEmbed() {
        // Add to embed
        help.addField(
          `__${capitaliseFirstLetter(this.name)}__`,
          `\n${this.commands
            .map((command) => command.formatTag())
            .join("\n")}\n`
        );
      }

      // Add new command
      addCommand(command) {
        this.commands.push(
          new CommandTag(command.name, command.arguments, command.description)
        );
      }
    }

    // Initialise embed
    const help = new SunnyEmbed()
      .setDefaultProperties()
      .setTitle("**Hello!**")
      .setDescription(
        "I am Sunny, a custom discord bot coded by DrBracewell. Check below for some commands you can use."
      );

    // Read command modules
    const files = readdirSync(__dirname);
    let helpSections: Map<string, HelpSection> = new Map();

    files
      .filter((file) => file.endsWith(".js"))
      .forEach((file) => {
        // Require module
        const command = require(`./${file}`).command;

        // Create category if it doesnt exist
        if (!helpSections.has(command.category))
          helpSections.set(command.category, new HelpSection(command.category));

        // Add command to section.
        helpSections.get(command.category).addCommand(command);
      });

    // Spread help sections and sort, then add to embed.
    new Map([...helpSections].sort()).forEach((section) => {
      section.appendToEmbed();
    });

    // Add final field and send embed
    help.addField(
      "\u200B",
      "You can also just try chatting to me normally, though sometimes I won't have the best responses, sorry!\n"
    );
    message.reply(help);
  },
};
