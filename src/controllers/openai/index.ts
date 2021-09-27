// Imports
import { execute as sendHug } from "@commands/hug";
import { openai } from "@json/tokens.json";

// Node Modules
import { randomBetween } from "drbracewell-random-tools";
import { Message, TextChannel } from "discord.js";

import OpenAI, { Completion } from "openai-api";
const session = new OpenAI(openai);

export class OpenAiRequest {
  message: Message;
  channel: TextChannel;
  response: Completion;

  constructor(message: Message) {
    this.message = message;
    this.channel = message.channel as TextChannel;
    this.sendRequest();
  }

  async sendRequest() {
    this.response = await session.complete({
      engine: "davinci",
      prompt: `Human: ${this.message.content}\nAI:`,
      maxTokens: 32,
      temperature: 0.6,
      topP: 1,
      presencePenalty: 0.6,
      frequencyPenalty: 0,
      bestOf: 1,
      n: 1,
      stop: ["\n", "Human:", "AI:"],
    });

    this.message.channel.send(this.response.data.choices[0].text);
  }
}
