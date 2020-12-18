import fetch from "node-fetch";
import { randomColour } from "drbracewell-random-tools";
import { Client, Message, MessageAttachment, MessageEmbed } from "discord.js";
import { MANSION } from "../constants";

module.exports = {
    name: "profile",
    category: "roleplay",
    description: "Provides the specified character profile.",
    arguments: "list (name)",
	execute(client: Client, message: Message, args: string[]) {
        if (message.guild.id !== MANSION.id) return;

        function characters(res) { 
            let finishedString = "";

            res.forEach(element => {
                finishedString += `${element.name.charAt(0).toUpperCase() + element.name.slice(1)}\n`;
            });

            return finishedString;
        }

        let profile = new MessageEmbed()
            .setColor(randomColour())
            .setTimestamp();

        let character = args[0].toLowerCase() == "list" ? "all" : args[0].toLowerCase()

        fetch(`http://sunny.drbracewell.co.uk/character?name=${character}`, {})
        .then(res => res.json())
        .then(res => {

            if (character == "all") {
                message.channel.send("```\n" + characters(res) + "```");
                return;
            }

            if (!res.ok) {
                message.channel.send(res.error)
            }

            character = character.charAt(0).toUpperCase() + character.slice(1);

            profile.setTitle(`${character}'s Profile.`)
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

            message.channel.send({embed: profile}).catch(error => console.log(error))
        })
        .catch(error => {
            console.log(error);
        })
	}
};