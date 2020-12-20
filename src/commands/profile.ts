import fetch from "node-fetch";
import { Client, Message, MessageAttachment } from "discord.js";
import { DEVELOPMENT, MANSION, TEST } from "../constants";
import { SunnyEmbed } from "../embeds";

module.exports = {
    name: "profile",
    category: "roleplay",
    description: "Provides the specified character profile.",
    arguments: "list <name>",
	execute(client: Client, message: Message, args: string[]) {
        if (message.guild.id !== (DEVELOPMENT ? TEST.id : MANSION.id)) return;
        if (args.length < 1) {
            message.channel.send("Please provide the name of a character! Use `$profile list` to see all characters.");
            return;
        }

        function characters(res) { 
            let finishedString = "";

            res.forEach(element => {
                finishedString += `${element.name.charAt(0).toUpperCase() + element.name.slice(1)}\n`;
            });

            return finishedString;
        }

        let character = args[0].toLowerCase() == "list" ? "all" : args[0].toLowerCase()

        fetch(`https://sunny.drbracewell.co.uk/character?name=${character}`)
        .then(res => {
            if (res.ok) {
                return res;
            } else {
                throw new Error(res.status === 404 ? "Oops, I can't find that character in the database!" : "Oops, something went wrong!");
            }
        })
        .then(res => res.json())
        .then(res => {

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
                let imageStream = Buffer.from(res.reference.img.data, 'base64');
                let attachment = new MessageAttachment(imageStream, "avatar.png");

                profile
                    .attachFiles([attachment])
                    .setImage(`attachment://avatar.png`)
                    .setFooter(`Image from/by ${res.reference.author}.`);
            }

            message.channel.send(profile).catch(error => console.log(error))
        })
        .catch(error => {
            message.reply(error.message);
            console.log(error);
        })
	}
};