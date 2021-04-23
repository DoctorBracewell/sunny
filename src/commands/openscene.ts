// Imports
import { OPEN_EMOJI } from "@constants";
import { OpenScene, sceneMap } from "@controllers/openscenes";

// Node Modules
import { Client, TextChannel } from "discord.js";

export async function initOpenScene(channel: TextChannel, client: Client) {
  const oldName = channel.name.replace(`${OPEN_EMOJI}-`, "");
  const newChannel = await channel.setName(`${OPEN_EMOJI}-${oldName}`);

  sceneMap.set(channel.id, new OpenScene(newChannel, oldName));
  sceneMap.get(channel.id).initChannelTimeout(client);
}

export const data: CommandData = {
  name: "openscene",
  category: "roleplay",
  description:
    "Mark a channel as an open scene by placing a unique emoji in the name.",
  args: [],
};

export async function execute({ client, message }: CommandParameters) {
  if (sceneMap.has(message.channel.id)) {
    message.reply("That channel is already marked as an open scene!");
    return;
  }

  await initOpenScene(message.channel as TextChannel, client);
}
