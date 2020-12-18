// Node Modules
import { SessionsClient } from "@google-cloud/dialogflow";
import { randomFromArray, randomBetween } from "drbracewell-random-tools";

// JSON Data
import { hugs } from "../../json/config.json";
import { gcp_id } from "../../json/tokens.json";

// Types
import { Message } from "discord.js";

// Main function
export async function main(message: Message) {
    // Dialog flow stuff can't be bothered to comment, Mostly self-explanatory anyway
    const projectId = gcp_id, sessionId = String(randomBetween(0, 100000)), sessionClient = new SessionsClient();
    const sessionPath = sessionClient.projectAgentSessionPath(projectId, sessionId);

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
        
        // TODO maybe change to command function?
        if (intentResponse.queryResult.action === "hug") {
            fufilNeeded = false;
            
            let fields = intentResponse.queryResult.parameters.fields
            let hugNumber = fields.hug_number.kind == "numberValue" ? fields.hug_number.numberValue > 20 ? 20 : fields.hug_number.numberValue : 1

            let interval = setInterval(() => {
                message.channel.send(randomFromArray(hugs))
                hugNumber--;

                if (hugNumber == 0) {
                    clearInterval(interval);
                }

            }, randomBetween(1000, 3000))

        }

        if (fufilNeeded) message.channel.send(intentResponse.queryResult.fulfillmentText);

    } catch (error) {
        console.log(error);
    }
}