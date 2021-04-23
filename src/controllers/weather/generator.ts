// Imports
import {
  Climate,
  RainStrength,
  RainTime,
  RainType,
  Report,
  WindStrength,
} from "@controllers/weather/dataStructures";

// Node Modules
import { randomBetween } from "drbracewell-random-tools";

function generateWind(rain: RainType): number {
  return rain === RainType.storm
    ? WindStrength.heavy
    : randomBetween(WindStrength.none, WindStrength.medium);
}

function generateRain({ temperature, clouds }: Report, rain: Report["rain"]) {
  // Return no rain if temp too hot or clouds too little (or 20% chance)
  if ([Climate.hot, Climate.burning].includes(temperature.climate)) return rain;
  if (clouds <= 3) return rain;
  if (Math.random() >= 0.8) return rain;

  // Otherwise there is rain
  rain.sort = RainType.rain;

  // Special cases (rare light showers, storm, snow or ice cream)

  // Snow
  if (temperature.climate === Climate.freezing) rain.sort = RainType.snow;
  // Storm/Blizzard
  if (clouds > 7 && Math.random() > 0.3)
    rain.sort =
      temperature.climate === Climate.freezing
        ? RainType.blizzard
        : RainType.storm;
  // Animals
  if (Math.random() > 0.99) rain.sort = RainType.animals;
  // Ice Cream
  if (Math.random() > 0.8 && temperature.climate === Climate.freezing)
    rain.sort = RainType.ice_cream;

  // Return straight away with light showers
  if (clouds === 4 && Math.random() > 0.5) {
    rain.time = RainTime.occasional;
    rain.strength = RainStrength.light;
    return rain;
  }

  // Decide time + strength
  if (clouds >= 7) {
    rain.time = randomBetween(RainTime.often, RainTime.constant);
    rain.strength = randomBetween(RainStrength.medium, RainStrength.heavy);
  } else {
    rain.time = randomBetween(RainTime.occasional, RainTime.often);
    rain.strength = randomBetween(RainStrength.light, RainStrength.medium);
  }

  return rain;
}

function generateClouds(climate: Climate): number {
  switch (climate) {
    case Climate.freezing:
      return randomBetween(1, 10);
    case Climate.cold:
      return randomBetween(5, 10);
    case Climate.cool:
      return randomBetween(3, 8);
    case Climate.warm:
      return randomBetween(2, 5);
    case Climate.hot:
      return randomBetween(0, 4);
    case Climate.burning:
      return randomBetween(0, 1);
  }
}

function generateExactTemperature(climate: Climate): number {
  const values = [
    [-12, 0],
    [1, 10],
    [11, 20],
    [21, 30],
    [31, 40],
    [41, 48],
  ];

  return randomBetween(...values[climate]);
}

function generateTemp(
  previousClimate: Climate,
  canChangeClimate: boolean
): Report["temperature"] {
  // Split into 20% chances
  const changeChance = randomBetween(1, 5);
  let climate = previousClimate;

  // If climate can change (default)
  if (canChangeClimate) {
    // If on edge, can't go further down or further up
    if ([Climate.freezing, Climate.burning].includes(previousClimate)) {
      // 40% chance to change climate
      if (changeChance <= 2)
        previousClimate === Climate.freezing ? climate++ : climate--;
    } else {
      if (changeChance === 1) climate--;
      if (changeChance === 2) climate++;
    }
  }

  // Return temperature object
  return {
    climate,
    exact: generateExactTemperature(climate),
  };
}

export const defaultReport = new Report({
  temperature: {
    climate: Climate.cool,
    exact: 15,
  },
  clouds: 1,
  rain: {
    sort: RainType.none,
    time: RainTime.none,
    strength: RainStrength.none,
  },
  wind: WindStrength.light,
  eventActive: false,
});

export function generateNewReport(
  previousReport: Report,
  canChangeClimate: boolean
) {
  let report = defaultReport;

  report.temperature = generateTemp(
    previousReport.temperature.climate,
    canChangeClimate
  );
  report.clouds = generateClouds(report.temperature.climate);
  report.rain = generateRain(report, defaultReport.rain);
  report.wind = generateWind(report.rain.sort);
  report.eventActive = Math.random() >= 0.95;

  return report;
}
