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
        help.addField(
          `__${capitaliseFirstLetter(this.name)}__`,
          `\n${this.commands
            .map((command) => command.formatTag())
            .join("\n")}\n`
        );
      }

      addCommand(command) {
        this.commands.push(
          new CommandTag(command.name, command.arguments, command.description)
        );
      }
    }

    const help = new SunnyEmbed()
      .setDefaultProperties()
      .setTitle("**Hello!**")
      .setDescription(
        "I am Sunny, a custom discord bot coded by DrBracewell. Check below for some commands you can use."
      );

    const files = readdirSync(__dirname);
    let helpSections: Map<string, HelpSection> = new Map();

    files
      .filter((file) => file.endsWith(".js"))
      .forEach((file) => {
        const command = require(`./${file}`).command;

        if (helpSections.has(command.category)) {
          helpSections.get(command.category).addCommand(command);
        } else {
          helpSections.set(command.category, new HelpSection(command.category));
          helpSections.get(command.category).addCommand(command);
        }
      });

    new Map([...helpSections].sort()).forEach((section) => {
      section.appendToEmbed();
    });

    help.addField(
      "\u200B",
      "You can also just try chatting to me normally, though sometimes I won't have the best responses, sorry!\n"
    );
    message.reply(help);
  },
};
