// Imports
import { MANSION } from "@constants";

// Node Modules
import { Message } from "discord.js";
import { randomBetween } from "drbracewell-random-tools";
import { get as getEmojiName } from "emoji-name-map";
import { random as getRandomEmoji } from "emoji-random";
import { model, Schema } from "mongoose";

export const UserModel = model(
  "reactions",
  new Schema({
    id: String,
  })
);

// Random reactions (as voted by the server (opt in tho (im not that evil (or am I???)))
export async function randomReactions(message: Message) {
  if (randomBetween(0, 100) === 0) {
    // 1/100 chance
    if (
      message.guild.id === MANSION.id &&
      (await UserModel.findOne({ id: message.member.id }))
    ) {
      // React with emojis
      let number = randomBetween(3, 10);

      for (let i = 0; i < number; i++) {
        // Choose emoji
        let emoji = getEmojiName(getRandomEmoji());

        // React with emoji (with catch cause discord doesnt have all)
        message.react(emoji).catch((error) => {
          if (error) console.error(error);
        });
      }
    }
  }
}
