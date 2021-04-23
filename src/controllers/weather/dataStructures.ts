// Node Modules
import { Document, Schema } from "mongoose";

export interface ReportModel extends Document {
  _id: number;
  temperature: {
    climate: Climate;
    exact: number;
  };
  clouds: number;
  rain: {
    sort: RainType;
    time: RainTime;
    strength: RainStrength;
  };
  wind: WindStrength;
  eventActive: boolean;
}

export const reportSchema = new Schema(
  {
    _id: Number,
    temperature: {
      climate: Number,
      exact: Number,
    },
    clouds: Number,
    rain: {
      sort: Number,
      time: Number,
      strength: Number,
    },
    wind: Number,
    eventActive: Boolean,
  },
  { _id: false }
);

export enum Climate {
  freezing,
  cold,
  cool,
  warm,
  hot,
  burning,
}

export enum RainType {
  none,
  rain,
  snow,
  storm,
  blizzard,
  animals,
  ice_cream,
}

export enum RainTime {
  none,
  occasional,
  often,
  constant,
}

export enum RainStrength {
  none,
  light,
  medium,
  heavy,
}

export enum WindStrength {
  none,
  light,
  medium,
  heavy,
}

export class Report {
  temperature: {
    climate: Climate;
    exact: number;
  };
  clouds: number;
  rain: {
    sort: RainType;
    time: RainTime;
    strength: RainStrength;
  };
  wind: WindStrength;
  eventActive: boolean;

  constructor(data: Report) {
    for (let key in data) {
      this[key] = data[key];
    }
  }
}
