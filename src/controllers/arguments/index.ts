export interface Argument {
  options: Array<{
    regex: RegExp;
    example: string;
  }>;
  default: string;
  required: boolean;
}

// Takes array of arguments (defined in command file)
export function parseArguments(
  argsSchemas: Argument[],
  argsStringArray: string[]
) {
  // Loop through each argument
  for (const argSchema of argsSchemas) {
    // If not required and not supplied, set to default
    console.log(argsStringArray);
    if (
      !argSchema.required &&
      argsStringArray[argsSchemas.indexOf(argSchema)] === undefined
    )
      argsStringArray[argsSchemas.indexOf(argSchema)] = argSchema.default;

    console.log(argsStringArray);

    // Loop through each argument option
    for (const argOption of argSchema.options) {
      // Extracted string from message to match
      const argString = argsStringArray[argSchema.options.indexOf(argOption)];

      // If it doesnt match, throw error to be caught in command handler
      if (!(argString ? argString : "").match(argOption.regex)) {
        if (argSchema.required)
          throw new Error(
            `Invalid Argument: \`${argString}\` does not match expected value of: ${argSchema.options.map(
              (option) => option.example
            )} | Use \`$help\` to see available arguments.`
          );
      }
    }
  }

  // If all arguments valid, return array of args
  return argsStringArray;
}
