import { Client, Message, TextChannel } from "discord.js";
import { OPEN_EMOJI } from "../constants";
import { OpenScene, sceneMap } from "../controllers/openscenes";

export function initOpenScene(channel: TextChannel, client: Client, oldName: string) {
    channel.setName(`${OPEN_EMOJI}-${oldName}`).then(newChannel => {
        sceneMap.set(channel.id, new OpenScene(newChannel, oldName));
        sceneMap.get(channel.id).initChannelTimeout(client);
    }).catch(error => console.log(error));
}

export const command = {
    name: "openscene",
    category: "roleplay",
    description: "Mark a channel as an open scene by placing a unique emoji in the name.",
    arguments: "",
    execute(client: Client, message: Message, args: string[]) {
        if (sceneMap.has(message.channel.id)) {
            message.reply("That channel is already marked as an open scene!");
            return;
        }

        initOpenScene(message.channel as TextChannel, client, (message.channel as TextChannel).name);
    }
}