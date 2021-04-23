// Imports
import { mongooseConnection, userSchemaStructure } from "@commands/toggle";
import { DEVELOPMENT, MANSION, TEST } from "@constants";

// Node Modules
import { Message } from "discord.js";
import { randomBetween } from "drbracewell-random-tools";
import * as getRandomEmoji from "get-random-emoji";
import { Schema } from "mongoose";

// Initialise model and export for use in toggle command module
export const ReactionsModel = mongooseConnection.model(
  "reactions",
  new Schema(userSchemaStructure, { collection: "reactions" })
);

// Random reactions (as voted by the server (opt in tho (im not that evil (or am I???)))
export async function randomReactions(message: Message) {
  if (randomBetween(0, 100) !== 0) return;
  if (message.guild.id !== (DEVELOPMENT ? TEST.id : MANSION.id)) return;

  const UserDocument = await ReactionsModel.findOne({ id: message.member.id });
  if (!UserDocument) return;

  let number = randomBetween(3, 10);
  for (let i = 0; i < number; i++) {
    // React with emoji (with catch because discord doesnt have all)
    message.react(getRandomEmoji()).catch((error) => {});
  }
}
