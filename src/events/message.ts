import { Client, Message } from "discord.js";
import { CTCODING, MANSION, PREFIX } from "../constants";
import * as users from "../json/users.json";
import { servers } from "../json/config.json";
import { main } from "./dialogflow/index";

// Node modules
import { randomBetween } from "drbracewell-random-tools"
import { get as getEmojiName } from "emoji-name-map";
import { random as getRandomEmoji} from "emoji-random";


module.exports = (client: Client, message: Message) => {
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

    // open 

    // yada yada return if these things happen
    if (message.author.bot || !(Object.values(servers).map(e => e.channels.bot).includes(message.channel.id)) || message.content.startsWith("//")) return;

    // Command handler
    if (message.content.startsWith(PREFIX)) {
        // Get the useful stuff
        const args = message.content.toLowerCase().slice(PREFIX.length).split(/ +/),
            command = args.shift().toLowerCase();

        const cmd = client.commands.get(command);

        // 404 command not found
        if (!cmd) {
            message.channel.send("I can't seem to find that command, sorry! Use `$help` to see a list of all commands.");
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

    // Don't do dialogflow in coding
    if (message.channel.id === CTCODING.channels.bot) return;

    // Dialogflow Main command
    main(message);
}