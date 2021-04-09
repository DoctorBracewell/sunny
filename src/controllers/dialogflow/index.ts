// Imports
import { execute as sendHug } from "@commands/hug";
import { gcp_id } from "@json/tokens.json";

// Node Modules
import { SessionsClient } from "@google-cloud/dialogflow";
import { randomBetween } from "drbracewell-random-tools";
import { Message } from "discord.js";

// Main function
export async function main(message: Message) {
  // Dialog flow stuff can't be bothered to comment, mostly self-explanatory anyway
  const projectId = gcp_id,
    sessionId = String(randomBetween(0, 100000)),
    sessionClient = new SessionsClient();
  const sessionPath = sessionClient.projectAgentSessionPath(
    projectId,
    sessionId
  );

  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        text: message.content,
        languageCode: "en-GB",
      },
    },
  };

  let intentResponse;
  let fufilNeeded = true;

  try {
    intentResponse = (await sessionClient.detectIntent(request))[0];

    if (intentResponse.queryResult.action === "hug") {
      fufilNeeded = false;

      let fields = intentResponse.queryResult.parameters.fields;
      let hugNumber: number =
        fields.hug_number.kind == "numberValue"
          ? fields.hug_number.numberValue > 20
            ? 20
            : fields.hug_number.numberValue
          : 1;

      sendHug({ client: null, message, args: [hugNumber.toString()] });
    }

    if (fufilNeeded)
      message.channel.send(intentResponse.queryResult.fulfillmentText);
  } catch (error) {
    console.log(error);
  }
}
