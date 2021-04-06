import * as randomWord from "random-words";
import { SunnyEmbed } from "../utils";
import { CommandArguments, CommandData } from "../command";

export const data: CommandData = {
  name: "anagram",
  category: "fun",
  description: "Starts a anagram contest.",
  args: [
    {
      options: [
        {
          regex: /easy/,
          example: "easy",
        },
        {
          regex: /hard/,
          example: "hard",
        },
        {
          regex: /extreme/,
          example: "extreme",
        },
      ],
      default: "easy",
      required: true,
    },
  ],
};

export async function execute({ message, args }: CommandArguments) {
  const difficultyChars = {
    easy: 1,
    hard: 6,
    extreme: 10,
  };

  let word = String(randomWord());
  while (word.length <= difficultyChars[args[0]]) {
    word = String(randomWord());
  }

  let embed = new SunnyEmbed()
    .setDefaultProperties()
    .setTitle("**Race to see who can unscramble the word below first!**")
    .setDescription(
      "If no-one can guess the word, the contest will disband after 1 minute."
    )
    .addField(
      "__Your scrambled word is__:",
      word
        .split("")
        .sort(function () {
          return 0.5 - Math.random();
        })
        .join("")
    );

  message.channel.send(embed);

  let finished = false;
  let collector = message.channel.createMessageCollector((m) => !m.author.bot, {
    time: 60000,
  });

  collector.on("collect", (message) => {
    if (message.content.toLowerCase() === word.toLowerCase()) {
      message.channel.send(
        `<@${message.author.id}> correctly unscrambled the word!`
      );
      finished = true;
      collector.stop();
    }
  });

  collector.on("end", () => {
    if (finished === false) {
      finished = true;
      message.channel.send(
        `No-one answered correctly, the word was __${word}__!`
      );
      collector.stop();
    }
  });
}
