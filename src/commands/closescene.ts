import { Client, Message} from "discord.js";
import { sceneMap } from "../controllers/openscenes";

module.exports = {
    name: "closescene",
    category: "roleplay",
    description: "Mark a currently open channel as closed by removing the emoji in the name.",
    arguments: "",
    execute(client: Client, message: Message, args: string[]) {
        if (!sceneMap.has(message.channel.id)) {
            message.reply("That channel is not marked as an open scene!");
            return;
        }
        
        const openScene = sceneMap.get(message.channel.id);
        openScene.resetChannel(openScene);
    }
}