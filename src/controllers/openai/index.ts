// Imports
import { openai } from "@json/tokens.json";

// Node Modules
import { Message, TextChannel } from "discord.js";

import OpenAI, { Completion } from "openai-api";
const session = new OpenAI(openai);

export class OpenAiSession {
  streams: OpenAiStream[];
  session: OpenAI;

  constructor() {
    this.session = new OpenAI(openai);
    this.streams = [];
  }

  recieveMessage(message: Message) {
    const stream = this.streams.find(
      (stream) => stream.channel.id === message.channel.id
    );

    // If there is not a stream associated with a channel, create one and add it to streams array
    if (!stream)
      return this.streams.push(
        new OpenAiStream(message.channel as TextChannel, message.content)
      );

    // Otherwise send message of stream associated with channel
    stream.sendMessage(message.content);
  }
}

class OpenAiStream {
  channel: TextChannel;
  messageAccumulator: number;
  convoAccumulator: string;
  response: Completion;

  constructor(channel: TextChannel, content: string) {
    this.channel = channel;
    this.resetConvo();
    this.sendMessage(content);
  }

  resetConvo() {
    this.messageAccumulator = 0;
    this.convoAccumulator = "";
  }

  async sendMessage(content: string) {
    if (this.messageAccumulator >= 5) this.resetConvo();

    this.convoAccumulator += `Human: ${content}\nAI:`;

    this.response = await session.complete({
      engine: "davinci",
      prompt: this.convoAccumulator,
      maxTokens: 50,
      temperature: 0.6,
      topP: 1,
      presencePenalty: 0.6,
      frequencyPenalty: 0,
      bestOf: 1,
      n: 1,
      stop: ["\n", "Human:", "AI:"],
    });

    const responseText = this.response.data.choices[0].text;
    this.messageAccumulator++;
    this.convoAccumulator += `${responseText}\n`;
    this.channel.send(responseText);
  }
}
