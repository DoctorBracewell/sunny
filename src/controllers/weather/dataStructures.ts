import { Document, Schema } from "mongoose";

export interface ReportInterface extends Document {
  _id: number;
  word: {
    text: string;
    num: number;
  };
  temp: number;
  clouds: number;
  rain: {
    rain: string;
    time: number;
    strength: number;
  };
  wind: number;
  event: {
    active: boolean;
    word: string;
  };
}

export const reportSchema = new Schema(
  {
    _id: Number,
    word: {
      text: String,
      num: Number,
    },
    temp: Number,
    clouds: Number,
    rain: {
      rain: String,
      time: Number,
      strength: Number,
    },
    wind: Number,
    event: {
      active: Boolean,
      word: String,
    },
  },
  { _id: false }
);
