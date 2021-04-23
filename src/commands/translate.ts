// Imports
import { SunnyEmbed, capitaliseFirstLetter } from "utils";
import * as languageArray from "@json/language-codes.json";

// Node Modules
import { v2 as GoogleTranslate } from "@google-cloud/translate";
import { ErrorTypes, UserError } from "@controllers/errors";

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
  // Extract parts
  const translate = new GoogleTranslate.Translate();
  const phrase = message.content.split(" ").slice(2).join(" ");

  // Check language provided for english name or native name
  const language = languageArray.find(
    ({ name, nativeName }) =>
      args[0] ===
      (name.toLowerCase() === args[0]
        ? name.toLowerCase()
        : nativeName.toLowerCase())
  )?.code;

  if (!language) throw new UserError(ErrorTypes.InvalidLanguage);

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
