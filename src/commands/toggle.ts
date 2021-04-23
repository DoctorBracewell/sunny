// Imports
import { MONGO_PASSWORD } from "@constants";
import { ReactionsModel } from "@controllers/reactions";

// Node Modules
import { createConnection } from "mongoose";

// Mongoose Setup
const mongoURI = `mongodb+srv://drbracewell:${MONGO_PASSWORD}@sunnyprofiles.uovhf.mongodb.net/opt_ins?retryWrites=true&w=majority`;
export const mongooseConnection = createConnection(mongoURI, {
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

// User schema structure for use in controller modules to make mongoose models
export const userSchemaStructure = {
  id: String,
};

// Create object to event models to use dynamically in execute functin
const eventModels = {
  reactions: ReactionsModel,
};

export async function execute({ message, args }: CommandParameters) {
  // Retrieve model for event
  const event = args[0];
  const UserModel = mongooseConnection.model(event, eventModels[event]);

  // Toggle opt-in
  if (await UserModel.findOne({ id: message.member.id }).exec()) {
    await UserModel.deleteOne({ id: message.member.id });
    message.reply(`Successfully opted **out** of ${event}!`);
  } else {
    await UserModel.create({ id: message.member.id });
    message.reply(`Successfully opted **in** to ${event}!`);
  }
}
