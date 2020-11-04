import { randomFromArray, randomBetween } from "drbracewell-random-tools";
import { hugs } from "../json/config.json";
import { Client, Message } from "discord.js";

module.exports = {
    name: 'hug',
    description: "Hug(s)!",
    arguments: "1-20",
    execute(client: Client, message: Message, args: string[]) {
      let number;

      if (args.length == 0) {
          number = 1
      } else {
          number = parseInt(args[0]) > 20 ? 20 : parseInt(args[0])
      }

      let interval = setInterval(() => {
          message.channel.send(randomFromArray(hugs))
          number--;

          if (number >= 0) clearInterval(interval)

      }, randomBetween(1000, 3000))
    }
  }