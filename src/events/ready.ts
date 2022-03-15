// Imports
import { statuses } from "@config";
import { initOpenScene } from "@commands/openscene";
import { DEVELOPMENT, MANSION, OPEN_EMOJI, TEST } from "@constants";
import { newReport } from "@controllers/weather";

// Node Modules
import { Client, TextChannel } from "discord.js";
import * as schedule from "node-schedule";
import { randomFromArray } from "drbracewell-random-tools";
import { BotError } from "@controllers/errors";

export async function main(client: Client) {
  // Show startup message and set activity
  console.log("-=+=- Starting Sunny -=+=-");
  client.user.setActivity(randomFromArray(statuses));

  const guild = await client.guilds.fetch(DEVELOPMENT ? TEST.id : MANSION.id);

  // Initialise open scenes
  guild.channels.cache
    .filter((channel) => channel.name.includes(`${OPEN_EMOJI}-`))
    .forEach((channel) => {
      initOpenScene(channel as TextChannel, client).catch((error) => {
        const channel = client.channels.cache.get(
          DEVELOPMENT ? TEST.channels.bot : MANSION.channels.bot
        ) as TextChannel;

        new BotError(error).send(channel);
      });
    });

  // Schedule weather and set up status changes
  schedule.scheduleJob({ hour: 9, minute: 0 }, () => {
    newReport(client, true);
    client.user.setActivity(randomFromArray(statuses));
  });
}
