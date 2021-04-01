import { randomBetween } from "drbracewell-random-tools";

const enums = ["FREEZING", "COLD", "COOL", "WARM", "HOT", "BURNING"];

export function generateWind(report) {
  if (["blizzard", "storm"].includes(report.rain.rain)) {
    return 4;
  } else {
    return randomBetween(1, 3);
  }
}

export function generateRain(report) {
  if (
    ["BURNING", "HOT"].includes(report.word.text) ||
    report.clouds <= 3 ||
    Math.random() >= 0.8 ||
    report.temp > 24
  )
    return { rain: "none", time: 0, strength: 0 };

  let rain = { rain: "rain", time: 0, strength: 0 };

  // light showers
  if (report.clouds < 5) {
    rain.time = 1;
    rain.strength = 1;
    return rain;
  }

  // storm
  if (report.clouds > 7 && Math.random() >= 0.1) {
    rain = {
      rain: report.word.text === "FREEZING" ? "blizzard" : "storm",
      time: 0,
      strength: 0,
    };
    return rain;
  }

  // else decide time + strength
  if (report.clouds >= 7) {
    rain.time = randomBetween(3, 4);
    rain.strength = randomBetween(2, 3);
  } else {
    rain.time = randomBetween(1, 3);
    rain.strength = randomBetween(1, 2);
  }

  if (report.word.text === "FREEZING") {
    rain.rain = "snow";
  }

  return rain;
}

export function generateClouds(word) {
  switch (word) {
    case enums[0]:
      return randomBetween(1, 10);
    case enums[1]:
      return randomBetween(5, 10);
    case enums[2]:
      return randomBetween(3, 8);
    case enums[3]:
      return randomBetween(2, 5);
    case enums[4]:
      return randomBetween(0, 4);
    case enums[5]:
      return randomBetween(0, 1);
  }
}

export function tempValue(temperature) {
  const values = [
    [-12, 0],
    [1, 10],
    [11, 20],
    [21, 30],
    [31, 40],
    [41, 48],
  ];

  const number = randomBetween(...values[temperature]);

  return {
    word: {
      text: enums[temperature],
      num: temperature,
    },
    temp: number,
  };
}

export function generateTemp(previous, changeType: boolean) {
  if ([0, 5].includes(previous)) {
    const change = randomBetween(1, 5);

    if (change <= 2 || !changeType) {
      // temp stays same
      return tempValue(previous);
    } else {
      // temp changes +1 or -1
      return previous === 0 ? tempValue(previous + 1) : tempValue(previous - 1);
    }
  } else {
    const change = randomBetween(1, 5);

    if (change === 1) {
      return tempValue(previous - 1);
    } else if (change === 2) {
      return tempValue(previous + 1);
    } else {
      return tempValue(previous);
    }
  }
}

export function generateEvent(report) {
  switch (report.word.text) {
    case "FREEZING":
      return "snowstorm";
    case "COLD":
      return "hailstorm";
    case "COOL":
      return "meteor shower";
    case "WARM":
      return "lightning storm";
    case "HOT":
      return "heatwave";
    case "BURNING":
      return "wildfire";
  }
}

export function stringPrecipitation(report) {
  if (report.rain.rain === "none") {
    return "It doesn't look like there'll be any rain today!";
  } else {
    let finished = "There will be ";

    finished +=
      report.rain.strength === 1
        ? "light"
        : report.rain.strength === 2
        ? "medium"
        : "heavy";

    finished +=
      report.rain.strength === 3 && report.word.text !== "FREEZING"
        ? " rain "
        : " showers ";

    finished += report.rain.rain === "snow" ? "of snow " : "";

    finished +=
      report.rain.time === 1
        ? "rarely"
        : report.rain.time === 2
        ? "occasionally"
        : report.rain.time === 3
        ? "often"
        : "constantly";

    finished += " throughout the day.";

    return finished;
  }
}

export function stringStorm(report) {
  let finished = "⛈️  Uh oh! Looks like there's going to be a **";

  finished += report.rain.rain;

  finished += "** today! Viewers are advised to stay inside just in case!  ⛈️";

  return finished;
}

export function stringWind(report) {
  if (report.wind === 1) {
    return "It doesn't look like there'll be any wind today!";
  } else {
    let finished = "There will be ";
    finished += report.wind === 2 ? "a " : "";

    finished +=
      report.wind === 2 ? "light" : report.wind === 3 ? "strong" : "powerful";

    finished += " ";

    finished +=
      report.wind === 2 ? "breeze" : report.wind === 3 ? "winds" : "gales";

    finished += " today.";

    return finished;
  }
}
