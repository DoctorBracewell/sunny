// Takes array of arguments (defined in command file)
export function parseArguments(
  argsSchemas: CommandArgument[],
  argsStringArray: string[]
) {
  // Loop through each argument
  for (const argSchema of argsSchemas) {
    // If not required and not supplied, set to default
    if (
      !argSchema.required &&
      argsStringArray[argsSchemas.indexOf(argSchema)] === undefined
    )
      argsStringArray[argsSchemas.indexOf(argSchema)] = argSchema.default;

    // Extract string from message to match
    const argString = argsStringArray[argsSchemas.indexOf(argSchema)];

    // If it doesnt match, throw error to be caught in command handler
    if (
      !argSchema.options.some((element) =>
        (argString ? argString : "").match(element.regex)
      )
    )
      throw new Error(
        `Invalid Argument: \`${argString}\` does not match expected value of: \`[${argSchema.options
          .map((option) => option.example)
          .join("/")}]\``
      );
  }

  // If all arguments valid, return array of args
  return argsStringArray;
}
