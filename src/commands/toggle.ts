import { Client, Message } from "discord.js";
import * as mongoose from "mongoose";
import { MONGO_PASSWORD } from "../constants";

const mongoURI = `mongodb+srv://drbracewell:${MONGO_PASSWORD}@sunnyprofiles.uovhf.mongodb.net/opt_ins?retryWrites=true&w=majority`;
export const UserSchema = new mongoose.Schema({
    id: String
});

mongoose.connect(mongoURI, {useNewUrlParser: true, useUnifiedTopology: true});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));


export const command = {
    name: "toggle",
    category: "utilities",
    description: "Opt in or out of recieving certain events.",
    arguments: "reactions",
    async execute(client: Client, message: Message, args: string[]) {
        if (args === [] || !["reactions"].includes(args[0])) {
            message.channel.send("Please provide an event to toggle on or off! Use `$help` to see avaliable toggles.");
            return;
        }

        const event = args[0];

        const UserModel = mongoose.model(event, UserSchema);

        if (await UserModel.findOne({ id: message.member.id }).exec()) {
            await UserModel.deleteOne({ id: message.member.id });
            message.reply(`Successfully opted **out** of ${event}!`);
        } else {
            await UserModel.create({ id: message.member.id })
            message.reply(`Successfully opted **in** to ${event}!`);
        }   
    }
}