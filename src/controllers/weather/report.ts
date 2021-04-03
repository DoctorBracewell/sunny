// Imports
import { createConnection } from "mongoose";
import { reportSchema, Report, ReportModel } from "./dataStructures";
import { MONGO_PASSWORD } from "../../constants";
import { defaultReport, generateNewReport } from "./generator";
import { formatEvent, formatReport } from "./formatReport";
import { TextChannel, Client } from "discord.js";

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

  constructor(discordClient: Client, changeClimate: boolean) {
    // Fetch channel
    // TODO allow development testing
    this.channel = discordClient.guilds.cache
      .get("612778224887267342")
      .channels.cache.get("739577642713350165") as TextChannel;

    // Fetch previous report
    this.fetchPreviousReport()
      .then((report) => {
        this.previous = report;
      })
      .catch((error) => {
        this.current = defaultReport;
        this.saveReport();
        throw error;
      });

    // Generate next report
    this.current = generateNewReport(this.previous, changeClimate);

    // Send report in channel and save
    this.sendReport();
    this.saveReport();
  }

  fetchPreviousReport = async () => {
    return await ReportModel.findById(1)
      .exec()
      .then((document) => document.toObject());
  };

  sendReport = async () => {
    await this.channel.send(formatReport(this.current));

    if (this.current.eventActive)
      await this.channel.send(formatEvent(this.current.temperature.climate));
  };

  saveReport = async () => {
    await ReportModel.findByIdAndDelete(1).exec();
    let document = new ReportModel({ _id: 1, ...this.current });
    await document.save();
  };
}

// TODO: Add function setup for every day + error handling + base case


export function newReport(client: Client, canChangeClimate: boolean) {
  let weatherReport = new WeatherReport(client, canChangeClimate);
}
hasError = (error) => {
  errorTagBrace(error, this.channel);
};*/
