import { MessageEmbed } from "discord.js";
import { randomColour } from "drbracewell-random-tools";

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

