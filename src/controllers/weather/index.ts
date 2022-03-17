// Imports
import { createConnection } from "mongoose";
import { reportSchema, Report, ReportModel } from "./dataStructures";
import { DEVELOPMENT, MANSION, MONGO_PASSWORD, TEST } from "../../constants";
import { defaultReport, generateNewReport } from "./generator";
import { formatEvent, formatReport } from "./formatReport";
import { TextChannel, Client } from "discord.js";
import { BotError } from "@controllers/errors";

// Database connection
const mongoURI = `mongodb+srv://drbracewell:${MONGO_PASSWORD}@sunnyprofiles.uovhf.mongodb.net/weather?retryWrites=true&w=majority`;
const weatherConnection = createConnection(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Rerport model
const ReportModel = weatherConnection.model<ReportModel>(
  "CurrentReport",
  reportSchema,
  "current"
);

// * Weather Report handler
// Fetches previous report, generates new report, sends report, saves new report
export class WeatherReport {
  previous: Report;
  current: Report;
  channel: TextChannel;
  error: Error[];

  constructor(channel: TextChannel, changeClimate: boolean) {
    // Saves channel
    this.channel = channel;

    // Fetch previous report
    this.fetchPreviousReport().then((report) => {
      this.previous = report;

      // Generate next report
      this.current = generateNewReport(this.previous, changeClimate);

      // Send report in channel and save
      this.sendReport();
      this.saveReport();
    });
  }

  // Fetch report and return as object
  fetchPreviousReport = () => {
    return ReportModel.findById(1)
      .exec()
      .then((document) => document.toObject())
      .catch(async (error) => {
        // If report doesn't exist, set current to default, save report
        this.current = defaultReport;
        this.saveReport();
        // Send error message and default report
        await new BotError(error).send(this.channel);

        await this.channel.send(
          "In the meantime, enjoy this completely fabricated report that I've randomly made up!"
        );
        return defaultReport;
      });
  };

  sendReport = async () => {
    await this.channel.send(formatReport(this.current));

    // Send report embed and ping
    if (this.current.eventActive) {
      await this.channel.send(formatEvent(this.current.temperature.climate));
      await this.channel.send(
        `<@&${
          this.channel.guild.roles.cache.find(
            (role) => role.name.toLowerCase() === "weather ping"
          ).id
        }>`
      );
    }
  };

  saveReport = async () => {
    try {
      await ReportModel.findByIdAndDelete(1).exec();
    } finally {
      let document = new ReportModel({ _id: 1, ...this.current });
      await document.save();
    }
  };
}

export async function newReport(client: Client, canChangeClimate: boolean) {
  // Fetch channel from cache
  let channel = client.guilds.cache
    .get(DEVELOPMENT ? TEST.id : MANSION.id)
    .channels.cache.find(
      (channel) => channel.name === "weather"
    ) as TextChannel;

  console.log(channel);

  // Try to generate weather
  try {
    new WeatherReport(channel, canChangeClimate);
  } catch (error) {
    await new BotError(error).send(channel);
  }
}
