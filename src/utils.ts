import { MessageEmbed, TextChannel } from "discord.js";
import { randomColour } from "drbracewell-random-tools";

// Custom embed to easily set custom footer or random colour
export class SunnyEmbed extends MessageEmbed {
  setDefaultColor() {
    this.setColor(randomColour());
    return this;
  }

  setDefaultFooter() {
    this.setFooter(`Made by DrBracewell · © ${new Date().getFullYear()}`);
    this.setTimestamp();
    return this;
  }

  setDefaultProperties() {
    this.setDefaultColor();
    this.setDefaultFooter();
    return this;
  }
}

export function capitaliseFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function tagDrBracewell() {
  return "<@262293669099470848>";
}

// Send an error embed in the supplied channel that tags developer
export async function errorTagBrace(error: Error, channel: TextChannel) {#
  console.error(error);
  const errorEmbed = new SunnyEmbed()
    .setDefaultFooter()
    .setColor("#ff0033")
    .setTitle("Oops, something went wrong!")
    .setDescription(`Perhaps ${tagDrBracewell()} could fix it?`)
    .addField("Error", error.message);

  await channel.send(errorEmbed);
}
