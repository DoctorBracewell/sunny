import { Client, TextChannel } from "discord.js";
import * as schedule from "node-schedule";
import { MANSION, PREFIX } from "../constants";
import weather from "../controllers/weather";
import { randomFromArray } from "drbracewell-random-tools";
import { statuses } from "../json/config.json";

module.exports = (client: Client) => {
    // Show startup message + Set activity + save rule reaction message in cache
    console.log('-=+=- Starting Sunny -=+=-');
    client.user.setActivity(randomFromArray(statuses));

    client.guilds.fetch(MANSION.id).then(guild => {
        const rulesChannel: TextChannel = guild.channels.cache.get(MANSION.channels.rules) as TextChannel;
        rulesChannel.messages.fetch('709784389222924389');
    });

    schedule.scheduleJob({hour: 9, minute: 0}, () => {
      weather(client);
      client.user.setActivity(randomFromArray(statuses));
    });
};

