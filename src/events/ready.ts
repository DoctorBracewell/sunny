import { Client, TextChannel } from "discord.js";
import * as schedule from "node-schedule";
import { DEVELOPMENT, MANSION, OPEN_EMOJI, TEST } from "../constants";
import weather from "../controllers/weather";
import { randomFromArray } from "drbracewell-random-tools";
import { statuses } from "../json/config.json";
import { initOpenScene } from "../commands/openscene";

export function main(client: Client) {
    // Show startup message
    console.log('-=+=- Starting Sunny -=+=-');
    client.user.setActivity(randomFromArray(statuses));

    // Save rule reaction message in cache and init open scenes
    client.guilds.fetch(DEVELOPMENT ? TEST.id : MANSION.id).then(guild => {
      if (!DEVELOPMENT) {
        const rulesChannel = guild.channels.cache.get(MANSION.channels.rules) as TextChannel;
        rulesChannel.messages.fetch('709784389222924389');
      }

      guild.channels.cache.filter(channel => channel.name.includes(`${OPEN_EMOJI}-`)).forEach(channel => {
        initOpenScene(channel as TextChannel, client, channel.name.replace(`${OPEN_EMOJI}-`, ""));
      })
    });

    // Schedule weather and set up status changes
    schedule.scheduleJob({hour: 9, minute: 0}, () => {
      weather(client);
      client.user.setActivity(randomFromArray(statuses));
    });
};

