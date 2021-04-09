// Imports
import { statuses } from "@config";
import { initOpenScene } from "@commands/openscene";
import { DEVELOPMENT, MANSION, OPEN_EMOJI, TEST } from "@constants";
import { newReport } from "@controllers/weather";

// Node Modules
import { Client, TextChannel } from "discord.js";
import * as schedule from "node-schedule";
import { randomFromArray } from "drbracewell-random-tools";

export async function main(client: Client) {
  // Show startup message and set activity
  console.log("-=+=- Starting Sunny -=+=-");
  client.user.setActivity(randomFromArray(statuses));

  const guild = await client.guilds.fetch(DEVELOPMENT ? TEST.id : MANSION.id);

  // Fetch rule channel
  if (!DEVELOPMENT) {
    const rulesChannel = guild.channels.cache.get(
      MANSION.channels.rules
    ) as TextChannel;
    rulesChannel.messages.fetch("709784389222924389");
  }

  // Initialise open scenes
  guild.channels.cache
    .filter((channel) => channel.name.includes(`${OPEN_EMOJI}-`))
    .forEach((channel) => {
      initOpenScene(channel as TextChannel, client);
    });

  // Schedule weather and set up status changes
  schedule.scheduleJob({ hour: 9, minute: 0 }, () => {
    newReport(client, true);
    client.user.setActivity(randomFromArray(statuses));
  });
}
