import { Client, Message } from "discord.js";
import { writeFile, readFileSync } from "fs";

module.exports = {
    name: 'reactions',
    description: "Opt in or out of getting reactions on your messages.",
    arguments: "",
    execute(client: Client, message: Message, args: string[]) {
        const users = JSON.parse(readFileSync("./json/users.json", "utf-8"));

        let newUsers = [];

        if (users.includes(message.author.id)) {
            newUsers = users.filter(id => id !== message.author.id);
            message.reply("Successfully opted **out of** reactions. You won't hear from me again.");
        } else {
            newUsers = [...users, message.author.id];
            message.reply("Successfully opted **into** random reactions on your messages. I will be in contact.");
        }


        writeFile("./json/users.json", JSON.stringify(newUsers), (err) => {
            if (err) throw err;

            writeFile("./json/userBackup.json", JSON.stringify(newUsers), (err) => {
                if (err) throw err;
            });
        });
    }
}