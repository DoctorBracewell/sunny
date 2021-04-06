import * as mongoose from "mongoose";
import { CommandArguments, CommandData } from "../command";
import { MONGO_PASSWORD } from "../constants";

const mongoURI = `mongodb+srv://drbracewell:${MONGO_PASSWORD}@sunnyprofiles.uovhf.mongodb.net/opt_ins?retryWrites=true&w=majority`;
export const UserSchema = new mongoose.Schema({
  id: String,
});

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));

export const data: CommandData = {
  name: "toggle",
  category: "utility",
  description: "Opt in or out of recieving certain events.",
  args: [
    {
      options: [
        {
          regex: /reactions/,
          example: "reactions",
        },
      ],
      default: "reactions",
      required: true,
    },
  ],
};

export async function execute({ message, args }: CommandArguments) {
  const event = args[0];

  const UserModel = mongoose.model(event, UserSchema);

  if (await UserModel.findOne({ id: message.member.id }).exec()) {
    await UserModel.deleteOne({ id: message.member.id });
    message.reply(`Successfully opted **out** of ${event}!`);
  } else {
    await UserModel.create({ id: message.member.id });
    message.reply(`Successfully opted **in** to ${event}!`);
  }
}
