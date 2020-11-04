import * as randomWord from "random-words";
import { randomColour } from "drbracewell-random-tools";
import { Client, Message, MessageEmbed } from "discord.js";

module.exports = {
    name: 'anagram',
    description: "Starts a anagram contenst",
    arguments: "easy hard extreme",
    execute(client: Client, message: Message, args: string[]) {
        const difficultyChars = {
          easy: 1,
          hard: 6,
          extreme: 10
        };

        let word = String(randomWord());

        if (args === [] || !["easy", "hard", "extreme"].includes(args[0])) {
          message.channel.send("Please send a valid anagram type; `easy` or `hard` or `extreme`.");
          return;
        }

        while (word.length <= difficultyChars[args[0]]) {
          word = String(randomWord());
        }

        let embed = new MessageEmbed()
          .setColor(randomColour())
          .setTitle("**Race to see who can unscramble the word below first!**")
          .setDescription("If no-one can guess the word, the contest will disband after 1 minute.")
          .addField("__Your scrambled word is__:", word.split('').sort(function(){return 0.5-Math.random()}).join(''))
          .setFooter("Use $anagram to start another contest!")
          .setTimestamp();

        message.channel.send(embed);

        let finished = false;
        let collector = message.channel.createMessageCollector(m => !m.author.bot, { time: 60000 });

        collector.on("collect", message => {
          if (message.content.toLowerCase() === word.toLowerCase()) {
            message.channel.send(`<@${message.author.id}> correctly unscrambled the word!`);
            finished = true;
            collector.stop();
          }
        })

        collector.on("end", () => {
          if (finished === false) {
            finished = true;
            message.channel.send(`No-one answered correctly, the word was __${word}__!`);
            collector.stop();
          }
        })
    }
}