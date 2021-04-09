// Imports
import { SunnyEmbed, capitaliseFirstLetter } from "utils";

// Node Modules
import { v2 as GoogleTranslate } from "@google-cloud/translate";
import ISO6391 from "iso-639-1";

export const data: CommandData = {
  name: "translate",
  category: "utility",
  description: "Translate a sentence into another language.",
  args: [
    {
      options: [
        {
          regex: /[a-z]/,
          example: "<language>",
        },
      ],
      default: "french",
      required: true,
    },
    {
      options: [
        {
          regex: /.+/,
          example: "<phrase>",
        },
      ],
      default: "Hello!",
      required: true,
    },
  ],
};

export async function execute({ message, args }: CommandParameters) {
  const translate = new GoogleTranslate.Translate(),
    language = ISO6391.getCode(args[0]),
    phrase = message.content.split(" ").slice(2).join(" ");

  if (!language)
    return message.reply(
      "oops, looks like something went wrong with the language you requested. Try again?"
    );

  let [translations] = await translate.translate(phrase, language);
  let translationsArray = Array.isArray(translations)
    ? translations
    : [translations];

  let embed = new SunnyEmbed()
      .setDefaultProperties()
      .setTitle(`Translations into ${capitaliseFirstLetter(args[0])}`),
    translationsString = "";

  translationsArray.forEach((translation, i) => {
    translationsString += `${phrase} **➤** (${language}) - ${translation}\n`;
  });

  message.channel.send(
    embed.addField("\u200B", translationsString + "\n\u200B")
  );
}
