import { Client, TextChannel } from "discord.js";
import { CommandArguments, CommandData } from "../command";
import { OPEN_EMOJI } from "../constants";
import { OpenScene, sceneMap } from "../controllers/openscenes";

export function initOpenScene(channel: TextChannel, client: Client) {
  const oldName = channel.name.replace(`${OPEN_EMOJI}-`, "");
  channel
    .setName(`${OPEN_EMOJI}-${oldName}`)
    .then((newChannel) => {
      sceneMap.set(channel.id, new OpenScene(newChannel, oldName));
      sceneMap.get(channel.id).initChannelTimeout(client);
    })
    .catch((error) => {
      console.log(error);
    });
}

export const data: CommandData = {
  name: "openscene",
  category: "roleplay",
  description:
    "Mark a channel as an open scene by placing a unique emoji in the name.",
  args: [],
};

export function execute({ client, message }: CommandArguments) {
  if (sceneMap.has(message.channel.id)) {
    message.reply("That channel is already marked as an open scene!");
    return;
  }

  initOpenScene(message.channel as TextChannel, client);
}
