import { Client, Message, TextChannel, Command } from "discord.js";
import { sceneMap } from "../controllers/openscenes";

export const command: Command = {
  name: "closescene",
  category: "roleplay",
  description:
    "Mark a currently open channel as closed by removing the emoji in the name.",
  arguments: [],
  execute(client: Client, message: Message, args: string[]) {
    const channel = message.channel as TextChannel;
    if (!sceneMap.has(channel.id)) {
      message.reply("That channel is not marked as an open scene!");
      return;
    }

    const openScene = sceneMap.get(message.channel.id);
    openScene.resetChannel(openScene);
  },
};
