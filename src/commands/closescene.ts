// Imports
import { sceneMap } from "@controllers/openscenes";

// Node Modules
import { TextChannel } from "discord.js";

export const data: CommandData = {
  name: "closescene",
  category: "roleplay",
  description:
    "Mark a currently open channel as closed by removing the emoji in the name.",
  args: [],
};

export function execute({ message }: CommandParameters) {
  const channel = message.channel as TextChannel;
  if (!sceneMap.has(channel.id)) {
    message.reply("That channel is not marked as an open scene!");
    return;
  }

  const openScene = sceneMap.get(message.channel.id);
  openScene.resetChannel(openScene);
}
