import { BotError } from "@controllers/errors";
// Imports
import { openai } from "@json/tokens.json";

// Node Modules
import { DiscordAPIError, Message, TextChannel } from "discord.js";

import OpenAI from "openai-api";
const session = new OpenAI(openai);

export class OpenAiSession {
  streams: OpenAiStream[];
  session: OpenAI;
  active: boolean;

  constructor() {
    this.session = new OpenAI(openai);
    this.streams = [];
    this.active = false;
  }

  async recieveMessage(message: Message) {
    const stream = this.streams.find(
      (stream) => stream.channel.id === message.channel.id
    );

    // If there is not a stream associated with a channel, create one and add it to streams array
    if (!stream)
      return this.streams.push(
        new OpenAiStream(message.channel as TextChannel, message.content)
      );

    if (this.active) return;

    this.active = true;
    // Otherwise send message of stream associated with channel
    await stream.sendMessage(message.content);

    this.active = false;
  }
}

class OpenAiStream {
  channel: TextChannel;
  conversation: ConversationStream;

  constructor(channel: TextChannel, content: string) {
    this.channel = channel;
    this.conversation = new ConversationStream(6);

    this.sendMessage(content);
  }

  async sendMessage(content: string) {
    if (content.length > 100)
      return this.channel.send(
        "(to keep brace's costs down, I'm not gonna reply to something that long. Try something shorter?)"
      );

    this.conversation.addChunk(content, false);

    try {
      // OpenAI GTP-3 davinci engine options for a friendly chatbot:
      const response = await session.complete({
        engine: "davinci",
        prompt:
          "The following is a conversation with an AI called Sunny. Sunny is unhelpful, sarcastic, clever, and narcissistic.\n\n" +
          this.conversation.stringifiedResponses +
          "\nSunny: ",
        maxTokens: 60,
        temperature: 0.7,
        topP: 1,
        presencePenalty: 0.5,
        frequencyPenalty: 0.5,
        bestOf: 1,
        stop: ["\n", "Human:", "Sunny:"],
      });

      const responseText = response.data.choices[0].text;
      this.conversation.addChunk(responseText, true);
      this.channel.send(responseText);
    } catch (error) {
      if (error instanceof DiscordAPIError) return;

      return new BotError(error).send(this.channel);
    }
  }
}

class ConversationStream {
  private responses: string[];

  constructor(private maxLength: number) {
    this.maxLength = maxLength;
    this.responses = [];
  }

  addChunk(chunk: string, ai: boolean) {
    if (this.responses.length >= this.maxLength) this.responses.shift();
    if (this.responses.includes(chunk)) this.responses = [];

    this.responses.push(`${ai ? "Sunny" : "Human"}: ${chunk.trim()}`);
  }

  get stringifiedResponses() {
    return this.responses.join("\n");
  }
}
