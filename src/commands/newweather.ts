// Imports
import { newReport } from "@controllers/weather";
import { MOD_ROLE } from "@constants";

export const data: CommandData = {
  name: "newweather",
  category: "utility",
  description: "For mod use only, creates a new weather report in the channel.",
  args: [],
};

export function execute({ client, message }: CommandParameters) {
  if (
    !message.guild
      .member(message.author)
      .roles.cache.find((role) => role.name === MOD_ROLE)
  )
    return;

  newReport(client, false);

  message.delete();
}
