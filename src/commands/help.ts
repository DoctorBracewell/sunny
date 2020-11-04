import { readdirSync } from "fs";
import { randomColour } from "drbracewell-random-tools";
import { Client, Command, Message, MessageEmbed } from "discord.js";

module.exports = {
  name: 'help',
  description: "Provides this message.",
  arguments: "",
	execute(client: Client, message: Message, args: string[]) {
		function helpString() {
      let finishedString = "- ";
      let cmdArgs = [];
      let list: string[] = [];
      let name = "";
    
      const files = readdirSync(__dirname);

      files.forEach(file => {
        if (!(file.endsWith(".js"))) return;
        const element: Command = require(`./${file}`);

        name = `- **$${element.name}** `;
        list.push(name);
    
        if (element.arguments != "") {
          if (element.arguments.includes("/")) {
            let seperateArguments = element.arguments.split("/");
            seperateArguments.forEach(element => {
              cmdArgs = element.split(" ");
              list[list.length - 1] += `[${cmdArgs.join("/")}] `
            })
          } else {
            cmdArgs = element.arguments.split(" ");
            list[list.length - 1] += `[${cmdArgs.join("/")}] `
          }
        }
      
          list[list.length - 1] += `= ${element.description}`;
          console.log(list)
        });

      finishedString = list.join("\n");
      return finishedString;
    };

    const help = new MessageEmbed()
        .setColor(randomColour())
        .setTitle("**Hello!**")
        .setDescription("I am Sunny, a custom discord bot coded by DrBracewell. Check below for some commands you can use.")
        .addField("__Commands__", `${helpString()}\n\n You can also just try chatting to me normally, though sometimes I won't have the best responses, sorry!\n\n**Have Fun!**`)
        .setFooter("I only work in #sunny")
        .setTimestamp();
    
    message.reply(help);
	}
};