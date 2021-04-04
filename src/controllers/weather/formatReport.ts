import * as dateFormat from "dateformat";
import { capitaliseFirstLetter, SunnyEmbed } from "../../utils";
import { Climate, RainType, Report, WindStrength } from "./dataStructures";

const FORMATTING_DATA = {
  climates: [
    {
      word: "freezing",
      event: { name: "snowstorm", emoji: "❄️" },
    },
    {
      word: "cold",
      event: { name: "hailstorm", emoji: "🌨️" },
    },
    {
      word: "cool",
      event: { name: "hurricane", emoji: "🌪️" },
    },
    {
      word: "warm",
      event: { name: "lightning storm", emoji: "🌪️" },
    },
    {
      word: "hot",
      event: { name: "heatwave", emoji: "🌶️" },
    },
    {
      word: "burning",
      event: { name: "wildfire", emoji: "🔥" },
    },
  ],
  winds: ["a light breeze", "strong winds", "powerful gales"],
  rains: [
    {
      time: "occasionally",
      strength: "light",
      word: "showers",
    },
    {
      time: "often",
      strength: "medium",
      word: "showers",
    },
    {
      time: "constantly",
      strength: "heavy",
      word: "rain",
    },
  ],
};

function formatPrecipitation({ sort, time, strength }: Report["rain"]) {
  // Specific lines
  if (sort === RainType.none)
    return "It doesn't look like there'll be any rain today!";
  if (sort === RainType.storm)
    return "⛈️  Uh oh! Looks like there's going to be a **storm** today! Viewers are advised to stay inside just in case!  ⛈️";
  if (sort === RainType.blizzard)
    return "🌨️  Uh oh! Looks like there's going to be a **blizzard** today! Viewers are advised to stay inside just in case!  🌨️";
  if (sort === RainType.animals)
    return "🐈 Well would you look at that! Apparently it's going to actually be raining **actual cats and dogs** today! Don't fret about these animals though, they're going to bounce right off the ground when they land and walk away right as rain! (gettit? rain??) 🐕";
  if (sort === RainType.ice_cream)
    return "🍨 What's this?! Folks, I'm just getting news that it's going to snow *ice cream* today! Well that certainly sounds like a treat, I hope no one's lactose intolerant! 🍨";

  // Rain string builder, produces outcome "There will be [light/medium/heavy] [showers/rain] <of snow> [occasionally/often/constantly] throughout the day"
  // prettier-ignore
  return `There will be ${
    FORMATTING_DATA.rains[strength - 1].strength
  } ${
    FORMATTING_DATA.rains[strength - 1].word
  } ${
    sort === RainType.snow ? "of snow " : ""
  } ${
    FORMATTING_DATA.rains[time - 1].time
  } throughout the day.`;
}

function formatWind(wind: number) {
  if (wind === WindStrength.none)
    return "It doesn't look like there'll be any wind today!";

  return `There will be ${FORMATTING_DATA.winds[wind - 1]} today.`;
}

export function formatReport({
  temperature: { exact, climate },
  clouds,
  rain,
  wind,
}: Report) {
  // Embed Setup
  const DATE = new Date();

  // Create embed
  return (
    new SunnyEmbed()
      .setDefaultFooter()
      .setAuthor("Ace Mansion Weather")
      .setTitle(dateFormat(DATE, "dddd, mmmm dS, yyyy"))
      .setDescription(
        `Welcome to the Ace Mansion Weather Report! The date is ${dateFormat(
          DATE,
          "dddd, mmmm dS, yyyy"
        )}, and as usual it's me, Sunny, to give you the low down on how the weather is today!\n`
      )

      // Colour
      .setColor(
        ["#8ed2e1", "#3e87cc", "#66cc3e", "#d6d451", "#c3621d", "#e02e2e"][
          climate
        ]
      )

      // Temperature
      .addField(
        "Temperature:",

        FORMATTING_DATA.climates[climate].word.toUpperCase() +
          "\n" +
          exact +
          "°C | " +
          (Math.round(exact * (9 / 5)) + 32) +
          "°F"
      )
      // Clouds
      .addField("Cloud Cover:", clouds + (clouds === 0 ? "%" : "0%"))
      // Precipitation
      .addField("Precipitation", formatPrecipitation(rain))
      // Wind
      .addField("Wind:", formatWind(wind))
      // Goodbye
      .addField(
        "\u200b",
        "That's all for today's Ace Mansion Weather report, I'll see you tomorrow at 9am sharp for the next one!"
      )
  );
}

export function formatEvent(climate: Climate) {
  const EMOJI = FORMATTING_DATA.climates[climate].event.emoji;
  const NAME = FORMATTING_DATA.climates[climate].event.name;

  return new SunnyEmbed()
    .setDefaultFooter()
    .setColor("#ff0505")
    .setAuthor("Ace Mansion Weather")
    .setTitle(`${EMOJI} ${capitaliseFirstLetter(NAME)} Warning ${EMOJI}`)
    .setDescription(`Hi folks, we're just getting news of a **${NAME}** today!`)
    .addField(
      "\u200b",
      "This event can be very dangerous, so make sure you stay indoors as much as you can and keep you and your friends and family safe!"
    );
}
