// Imports
import { DEVELOPMENT, MANSION, TEST } from "@constants";
import { SunnyEmbed } from "utils";

// Node Modules
import fetch from "node-fetch";
import { MessageAttachment } from "discord.js";

export const data: CommandData = {
  name: "profile",
  category: "roleplay",
  description: "Provides the specified character profile.",
  args: [
    {
      options: [
        {
          regex: /list/,
          example: "list",
        },
        {
          regex: /\w+/,
          example: "<name>",
        },
      ],
      default: "list",
      required: true,
    },
  ],
};

export function execute({ message, args }: CommandParameters) {
  if (message.guild.id !== (DEVELOPMENT ? TEST.id : MANSION.id)) return;

  function characters(res) {
    let finishedString = "";

    res.forEach((element) => {
      finishedString += `${
        element.name.charAt(0).toUpperCase() + element.name.slice(1)
      }\n`;
    });

    return finishedString;
  }

  let character =
    args[0].toLowerCase() == "list" ? "all" : args[0].toLowerCase();

  fetch(`https://sunny.drbracewell.co.uk/character?name=${character}`)
    .then((res) => {
      if (res.ok) {
        return res;
      } else {
        throw new Error(
          res.status === 404
            ? "Oops, I can't find that character in the database!"
            : "Oops, something went wrong!"
        );
      }
    })
    .then((res) => res.json())
    .then((res) => {
      if (character == "all") {
        message.channel.send("```\n" + characters(res) + "```");
        return;
      }

      character = character.charAt(0).toUpperCase() + character.slice(1);

      let profile = new SunnyEmbed()
        .setDefaultColor()
        .setTitle(`${character}'s Profile.`)
        .addField("Full Name: ", res.fullname)
        .addField("Gender: ", res.gender)
        .addField("Species: ", res.species)
        .addField("Age: ", res.age)
        .addField("Significant Other: ", res.so)
        .addField("Physical Description: ", res.physical)
        .addField("About: ", res.about);

      if (res.reference) {
        let imageStream = Buffer.from(res.reference.img.data, "base64");
        let attachment = new MessageAttachment(imageStream, "avatar.png");

        profile
          .attachFiles([attachment])
          .setImage(`attachment://avatar.png`)
          .setFooter(`Image from/by ${res.reference.author}.`);
      }

      message.channel.send(profile).catch((error) => console.log(error));
    })
    .catch((error) => {
      message.reply(error.message);
      console.log(error);
    });
}
