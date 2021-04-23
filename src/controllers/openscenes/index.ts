// Node Modules
import { Client, TextChannel } from "discord.js";

export let sceneMap = new Map();

export class OpenScene {
  channel: TextChannel;
  oldName: string;

  constructor(channel, oldName) {
    this.channel = channel;
    this.oldName = oldName;
  }

  resetChannel() {
    this.channel.setName(this.oldName).then((newChannel) => {
      sceneMap.delete(newChannel.id);
    });
  }

  initChannelTimeout(client: Client): void {
    let self = this;

    function initTimeout() {
      return setTimeout(() => self.resetChannel(), 1000 * 60 * 60);
    }

    let timeout = initTimeout();

    client.on("message", (message) => {
      if (message.author.bot) return;
      if (message.channel.id === this.channel.id) {
        clearTimeout(timeout);
        timeout = initTimeout();
      }
    });
  }
}
