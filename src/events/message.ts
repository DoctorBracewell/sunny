import { Client, Guild, Message, TextChannel } from "discord.js";
import { CTCODING, MANSION, PREFIX, DEVELOPMENT } from "../constants";
import * as users from "../json/users.json";
import { servers } from "../json/config.json";
import { main as runDialogflowRequest } from "./dialogflow/index";

// Node modules
import { randomBetween } from "drbracewell-random-tools"
import { get as getEmojiName } from "emoji-name-map";
import { random as getRandomEmoji} from "emoji-random";


module.exports = (client: Client, message: Message) => {
    const channel = message.channel as TextChannel;

    // Random reactions (as voted by the server (opt in tho (im not that evil (or am I???)))
    if (message.guild.id === MANSION.id && (users.includes(message.author.id))) {
        // 1/100 chance
        if (randomBetween(0, 100) === 0) {
            // number of emojis
            let number = randomBetween(3, 10);

            // for loop
            try {
                for (let i = 0; i < number; i++) {
                    // choose emoji
                    let emoji = getEmojiName(getRandomEmoji());
                    
                    // react (with catch cause discord doesnt have all)
                    message.react(emoji).catch(error => {
                        if (error) console.error(error);
                    });
                }
            } catch(error) {}
        }
    }

    // yada yada return if these things happen
    if (message.author.bot) return;
    if (message.content.startsWith("//")) return;

    // Check Channels
    let validChannels = [];

    if (DEVELOPMENT) {
        if (["$openscene", "$closescene"].some(command => message.content.includes(command)) && message.guild.id === servers.test.id) {
            let roleId = message.guild.roles.cache.find(role => role.name === "Open Scene Channels").id;

            try {
                if (channel.parent.permissionOverwrites.get(roleId).allow.bitfield === 8192) {
                    validChannels.push(channel.id);
                } else {
                    throw new Error("Channel Not Valid");
                }
            } catch(error) {
                console.log("This channel cannot be marked as an open scene!");
            }
        } else {
            validChannels.push(servers.test.channels.bot);
        }
    } else if (["$openscene", "$closescene"].some(command => message.content.includes(command)) && message.guild.id === MANSION.id) {
        let roleId = message.guild.roles.cache.find(role => role.name === "Open Scene Channels").id;

        try {
            if (channel.parent.permissionOverwrites.get(roleId).allow.bitfield === 8192) {
                validChannels.push(channel.id);
            } else {
                throw new Error("Channel Not Valid");
            }
        } catch(error) {
            console.log("This channel cannot be marked as an open scene!");
        }
    } else {
        validChannels = Object.values(servers).map(e => e.channels.bot);
    }

    if (!validChannels.includes(channel.id)) return;

    // Command handler
    if (message.content.startsWith(PREFIX)) {
        // Get the useful stuff
        const args = message.content.toLowerCase().slice(PREFIX.length).split(/ +/),
            command = args.shift().toLowerCase();

        const cmd = client.commands.get(command);        

        // 404 command not found
        if (!cmd) {
            channel.send("I can't seem to find that command, sorry! Use `$help` to see a list of all commands.");
            return;
        }

        try {
            client.commands.get(command).execute(client, message, args);
        } catch (error) {
            console.error(error);
            message.reply('There was an error trying to execute that command!');
        }

        return;
    }

    // Dialogflow
    if (channel.id === CTCODING.channels.bot) return;
    runDialogflowRequest(message);
}