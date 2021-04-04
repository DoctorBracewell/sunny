import { randomFromArray, randomBetween } from "drbracewell-random-tools";
import { hugs } from "../json/config.json";
import { Client, Message, Command } from "discord.js";

export const command: Command = {
  name: "hug",
  category: "fun",
  description: "Hug(s)!",
  arguments: [
    {
      options: [
        {
          regex: /[1-9]/,
          example: "1-20",
        },
      ],
      default: "1",
      required: false,
    },
  ],
  execute(client: Client, message: Message, args: string[]) {
    // Number default
    let number = parseInt(args[0]);

    let interval = setInterval(() => {
      message.channel.send(randomFromArray(hugs));
      number--;

      if (number === 0) clearInterval(interval);
    }, randomBetween(1000, 3000));
  },
};
