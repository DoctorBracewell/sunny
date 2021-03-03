import { MessageEmbed } from "discord.js";
import { randomColour } from "drbracewell-random-tools";

export class SunnyEmbed extends MessageEmbed {
    embed = new MessageEmbed();

    setDefaultColor() {
        this.embed.setColor(randomColour());
        return this.embed;
    }

    setDefaultFooter() {
        this.embed.setFooter(`Made by DrBracewell · © ${new Date().getFullYear()}`);
        this.embed.setTimestamp();
        return this.embed;
    }

    setDefaultProperties() {
        this.setDefaultColor();
        this.setDefaultFooter();
        return this.embed;
    }
}

export function capitaliseFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

