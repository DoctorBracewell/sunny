// Imports

import * as dateFormat from "dateformat";
import { createConnection, ObjectId } from "mongoose";
import { reportSchema, ReportInterface } from "./dataStructures";
import { MONGO_PASSWORD } from "../../constants";
import { Client, TextChannel } from "discord.js";
import { SunnyEmbed } from "../../utils";
import * as formatter from "./formatReport";

// Database connection
const mongoURI = `mongodb+srv://drbracewell:${MONGO_PASSWORD}@sunnyprofiles.uovhf.mongodb.net/weather?retryWrites=true&w=majority`;
const weatherConnection = createConnection(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const ReportModel = weatherConnection.model<ReportInterface>(
  "CurrentReport",
  reportSchema,
  "current"
);

// Main function
export default async function (discordClient: Client, changeType: boolean) {
  // Fetch channel
  const channel: TextChannel = discordClient.guilds.cache
    .get("612778224887267342")
    .channels.cache.get("739577642713350165") as TextChannel;

  // Fetch current report
  const file = await ReportModel.findById(1).exec();

  // Fetch report
  let init: any = formatter.generateTemp(file.word.num, changeType);
  init.clouds = formatter.generateClouds(init.word.text);
  init.rain = formatter.generateRain(init);
  init.wind = formatter.generateWind(init);

  let report = init;
  report.event = {};

  // Check if special event
  if (Math.random() >= 0.95) {
    report.event.active = false;
    report.event.word = formatter.generateEvent(report);
  } else {
    report.event.active = false;
  }

  // Embed Setup
  const date = new Date();

  const colours = {
    FREEZING: "#8ed2e1",
    COLD: "#3e87cc",
    COOL: "#66cc3e",
    WARM: "#d6d451",
    HOT: "#c3621d",
    BURNING: "#e02e2e",
  };

  let embed = new SunnyEmbed()
    .setDefaultFooter()
    .setAuthor("Ace Mansion Weather")
    .setTitle(dateFormat(date, "dddd, mmmm dS, yyyy"))
    .setDescription(
      `Welcome to the Ace Mansion Weather Report! The date is ${dateFormat(
        date,
        "dddd, mmmm dS, yyyy"
      )}, and as usual it's me, Sunny, to give you the low down on how the weather is today!\n`
    )
    .setColor(colours[report.word.text])
    .addField(
      "Temperature:",
      `${report.word.text}\n${report.temp}°C | ${
        Math.round(report.temp * (9 / 5)) + 32
      }°F`
    )
    .addField(
      "Cloud Cover:",
      `${report.clouds + (report.clouds === 0 ? "" : "0")}%`
    )
    .addField(
      "Precipitation",
      ["storm", "blizzard"].includes(report.rain.rain)
        ? formatter.stringStorm(report)
        : formatter.stringPrecipitation(report)
    )
    .addField("Wind:", formatter.stringWind(report))
    .addField(
      "\u200b",
      "That's all for today's Ace Mansion Weather report, I'll see you tomorrow at 9am sharp for the next one!"
    );

  // Send report embed
  await channel.send(embed);

  // Send event embed
  if (report.event.active) {
    const warnEmbed = new SunnyEmbed()
      .setDefaultFooter()
      .setAuthor("Ace Mansion Weather")
      .setTitle(
        `${
          report.event.word.toUpperCase() + report.event.word.slice(1)
        } Warning`
      )
      .setDescription(
        `Hi folks, we're just getting news of a **${report.even.word}** today!`
      )
      .setColor("#ff0505")
      .addField(
        "\u200b",
        "This event can be very dangerous, so make sure you stay indoors as much as you can and keep you and your friends and family safe!"
      );

    await channel.send(warnEmbed);
    channel.send("<@&739572840935981067>");
  }

  let newReport = new ReportModel(report);
  newReport._id = 1;

  await ReportModel.findByIdAndDelete(1).exec();
  await newReport.save();
}
