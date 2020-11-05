// Imports
import { randomBetween } from "drbracewell-random-tools";
import { writeFile } from "fs";
import * as dateFormat from "dateformat";

// Current weather
import * as file from "../../json/weather.json";
import { Client, MessageEmbed, TextChannel } from "discord.js";

function generateWind(report) {
    if (["blizzard", "storm"].includes(report.rain.rain)) {
        return 4;
    }
    else {
        return randomBetween(1, 3);
    }
}

function generateRain(report) {
    if ( ["BURNING", "HOT"].includes(report.word.text) || report.clouds <= 3 || Math.random() >= 0.8 || report.temp > 24) return {rain: "none", time: 0, strength: 0}

    let rain = {rain: "rain", time:0, strength: 0};

    // light showers
    if (report.clouds < 5) {
        rain.time = 1;
        rain.strength = 1;
        return rain;
    }

    // storm
    if (report.clouds > 7 && Math.random() >= 0.1) {
        rain = {rain: (report.word.text === "FREEZING" ? "blizzard" : "storm"), time: 0, strength: 0};
        return rain;
    }
    
    // else decide time + strength
    if (report.clouds >= 7) {
        rain.time = randomBetween(3, 4);
        rain.strength = randomBetween(2, 3);
    } else {
        rain.time = randomBetween(1, 3);
        rain.strength =randomBetween(1, 2);
    }

    if (report.word.text === "FREEZING") {
        rain.rain = "snow";
    }

    return rain;
}

function generateClouds(word) {
    switch (word) {
        case file.enums[0]:
            return randomBetween(1, 10);
        case file.enums[1]:
            return randomBetween(5, 10);
        case file.enums[2]:
            return randomBetween(3, 8);
        case file.enums[3]:
            return randomBetween(2, 5);
        case file.enums[4]:
            return randomBetween(0, 4);
        case file.enums[5]:
            return randomBetween(0, 1);
    }
}

function tempValue(temperature) {
    const values = [
        [-12, 0],
        [1, 10],
        [11, 20],
        [21, 30],
        [31, 40],
        [41, 48]
    ];

    const number = randomBetween(...(values[temperature]));

    return {
        word: {
            text: file.enums[temperature],
            num: temperature
        },
        temp: number
    };
}

function generateTemp(previous) {
    if ([0, 5].includes(previous)) {
        const change = randomBetween(1, 5);

        if (change <= 2) {
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

function generateEvent(report) {
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

function stringPrecipitation(report) {
    if (report.rain.rain === "none") {
        return "It doesn't look like there'll be any rain today!"
    } else {
        let finished = "There will be ";

        finished += report.rain.strength === 1 ? "light" : (report.rain.strength === 2 ? "medium" : "heavy");
    
        finished += (report.rain.strength === 3 && report.word.text !== "FREEZING") ? " rain " : " showers ";

        finished += report.rain.rain === "snow" ? "of snow " : "";
    
        finished += report.rain.time === 1 ? "rarely" : (report.rain.time === 2 ? "occasionally" : (report.rain.time === 3 ? "often" : "constantly"));
    
        finished += " throughout the day."
    
        return finished;
    }
}

function stringStorm(report) {
    let finished = "⛈️  Uh oh! Looks like there's going to be a **"

    finished += report.rain.rain

    finished += "** today! Viewers are advised to stay inside just in case!  ⛈️";

    return finished;
}

function stringWind(report) {
    if (report.wind === 1) {
        return "It doesn't look like there'll be any wind today!";
    } else {
        let finished = "There will be "
        finished += report.wind === 2 ? "a " : "";

        finished += report.wind === 2 ? "light" : (report.wind === 3 ? "strong" : "powerful");

        finished += " "

        finished += report.wind === 2 ? "breeze" : (report.wind === 3 ? "winds" : "gales");

        finished += " today.";

        return finished;
    }
}

// Main function
export default async function (discordClient: Client) {
    // Fetch channel
    const channel: TextChannel = discordClient.guilds.cache.get("612778224887267342").channels.cache.get('739577642713350165') as TextChannel;

    // Fetch report
    let init: any = generateTemp(file.current.word.num)
    init.clouds = generateClouds(init.word.text);
    init.rain = generateRain(init);
    init.wind = generateWind(init);

    let report = init;

    // Check if special event
    if (Math.random() >= 0.95) {
        report.event = generateEvent(report);
    } else {
        report.event = false;
    }


    // Embed Setup
    const date = new Date();

    const colours = {
        FREEZING: "#8ed2e1",
        COLD: "#3e87cc",
        COOL: "#66cc3e",
        WARM: "#d6d451",
        HOT: "#c3621d",
        BURNING: "#e02e2e"
    }

    let embed = new MessageEmbed()
        .setAuthor("Ace Mansion Weather")
        .setTitle(dateFormat(date, "dddd, mmmm dS, yyyy"))
        .setDescription(`Welcome to the Ace Mansion Weather Report! The date is ${dateFormat(date, "dddd, mmmm dS, yyyy")}, and as usual it's me, Sunny, to give you the low down on how the weather is today!\n`)
        .setColor(colours[report.word.text])
        .setTimestamp()
        .addField("Temperature:", `${report.word.text}\n${report.temp}°C | ${Math.round(report.temp * (9/5)) + 32}°F`)
        .addField("Cloud Cover:", `${report.clouds + (report.clouds === 0 ? "" : "0")}%`)
        .addField("Precipitation", (["storm", "blizzard"].includes(report.rain.rain) ? stringStorm(report) : stringPrecipitation(report)))
        .addField("Wind:", stringWind(report))
        .addField("\u200b", "That's all for today's Ace Mansion Weather report, I'll see you tomorrow at 9am sharp for the next one!");

    // Send report embed
    await channel.send(embed);

    // Send event embed
    if (report.event) {
        const warnEmbed = new MessageEmbed()
            .setAuthor("Ace Mansion Weather")
            .setTitle(`${report.event[0].toUpperCase() + report.event.slice(1)} Warning`)
            .setDescription(`Hi folks, we're just getting news of a **${report.event}** today!`)
            .setColor("#ff0505")
            .setTimestamp()
            .addField("\u200b", "This event can be very dangerous, so make sure you stay indoors as much as you can and keep you and your friends and family safe!");

        await channel.send(warnEmbed);
        channel.send("<@&739572840935981067>");
    }

    // Update report
    let newFile = file;
    newFile.current = report;

    writeFile("src/json/weather.json", JSON.stringify(newFile), (err) => {
        if (err) return console.log(err);
    });
}

