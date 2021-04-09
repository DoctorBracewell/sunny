// Imports
import { MONGO_PASSWORD } from "@constants";
import { UserModel } from "@controllers/reactions";

// Node Modules
import { createConnection } from "mongoose";

// Mongoose Setup
const mongoURI = `mongodb+srv://drbracewell:${MONGO_PASSWORD}@sunnyprofiles.uovhf.mongodb.net/opt_ins?retryWrites=true&w=majority`;
createConnection(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

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

export async function execute({ message, args }: CommandParameters) {
  const event = args[0];

  if (await UserModel.findOne({ id: message.member.id }).exec()) {
    await UserModel.deleteOne({ id: message.member.id });
    message.reply(`Successfully opted **out** of ${event}!`);
  } else {
    await UserModel.create({ id: message.member.id });
    message.reply(`Successfully opted **in** to ${event}!`);
  }
}
