// Node Modules
import { Message } from "discord.js";
import { randomBetween } from "drbracewell-random-tools";

export class Roll {
  message: Message;
  diceNumber: number;
  faces: number;
  bonus: number;
  comment: string;
  total: {
    number: number;
    list: Array<number>;
  };
  resultString: string;

  constructor(message: Message) {
    // Extract message parts
    const parsed = message.content.match(
        /\/r\s(\d+d\d+)(?:([\+\-]\d))?(?:\s#(.+))?/
      ),
      diceConfig = parsed[1].split("d");

    // Assign to instance
    this.message = message;
    this.diceNumber = parseInt(diceConfig[0]);
    this.faces = parseInt(diceConfig[1]);
    this.bonus = parsed[2] ? parseInt(parsed[2]) : 0;
    this.comment = parsed[3] ? ` ${parsed[3]}` : "";
    this.total = {
      number: 0,
      list: new Array(),
    };
    this.resultString = `<@${this.message.author.id}>: \`${parsed[1]}\`${this.comment} = (`;

    // If above 40
    for (const number of [this.diceNumber, this.faces]) {
      if (number > 400) {
        message.reply(
          "the dice config you have provided is invalid: One of the numbers is above its maximum `400`."
        );
        return;
      }
    }

    this.calculateRoll();
  }

  calculateRoll() {
    for (let roll = 0; roll < this.diceNumber; roll++) {
      const dice: number = randomBetween(1, this.faces);

      this.total.number += dice;
      this.total.list.push(dice);
    }

    this.formatString();
  }

  formatString() {
    for (const number of this.total.list) {
      this.resultString += number;
      this.resultString += "+";
    }

    this.resultString = this.resultString.slice(0, -1);
    if (this.bonus)
      this.resultString += `) ${
        this.bonus > 0
          ? `+ ${this.bonus}`
          : this.bonus.toString().split("").join(" ")
      }`;
    this.resultString += `${this.bonus ? "" : ")"} = ${
      this.total.number + this.bonus
    }`;

    this.sendResult();
  }

  sendResult() {
    this.message.channel.send(this.resultString);
  }
}
