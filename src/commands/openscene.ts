import { Client, Message, TextChannel } from "discord.js";
import { OPEN_EMOJI } from "../constants";
import { OpenScene, sceneMap } from "../events/openscenes/controller";

module.exports = {
    name: 'openscene',
    description: "Mark a channel as an open scene by placing a unique emoji in the name.",
    arguments: "",
    execute(client: Client, message: Message, args: string[]) {
        if (sceneMap.has(message.channel.id)) {
            message.reply("That channel is already marked as an open scene!");
            return;
        }

        const channel = message.channel as TextChannel;
        const OLD_NAME = channel.name;

        channel.setName(`${OPEN_EMOJI}-${OLD_NAME}`).then(newChannel => {
            sceneMap.set(message.channel.id, new OpenScene(newChannel, OLD_NAME));
            sceneMap.get(message.channel.id).initChannelTimeout(client);
        }).catch(error => console.log(error));
    }
}