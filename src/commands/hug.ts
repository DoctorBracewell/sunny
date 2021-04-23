// Imports
import { hugs } from "@config";

// Node Modules
import { randomFromArray, randomBetween } from "drbracewell-random-tools";

export const data: CommandData = {
  name: "hug",
  category: "fun",
  description: "Hug(s)!",
  args: [
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
};

export async function execute({ message, args }: CommandParameters) {
  let number = parseInt(args[0]);

  let interval = setInterval(() => {
    message.channel.send(randomFromArray(hugs));
    number--;

    if (number === 0) clearInterval(interval);
  }, randomBetween(1000, 3000));
}
