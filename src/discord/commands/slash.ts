import { REST } from '@discordjs/rest';
import { ApplicationCommandOptionType, Routes } from 'discord-api-types/v10';
import type {
  Attachment,
  User,
  ChatInputCommandInteraction,
  APIInteractionDataResolvedChannel,
  GuildBasedChannel
} from 'discord.js';

type Choice = number | string;

export interface CommandOptionType {
  string: string;
  int: number;
  float: number;
  bool: boolean;
  choice: Choice;
  user: User;
  channel: APIInteractionDataResolvedChannel | GuildBasedChannel;
  attachment: Attachment;
}
type Type = keyof CommandOptionType;

type Choices = readonly Choice[] | Record<string, Choice>;
type ValueFromChoices<T extends Choices> = T extends readonly Choice[]
  ? T[number]
  : T[keyof T];

export type AutocompleteHandler = (option: string) => Promise<Choices>;
interface Option<T extends Type = Type, C extends Choices = Choices> {
  type: T;
  desc: string;
  min?: number;
  max?: number;
  choices?: C;
  optional?: boolean;
  default?: CommandOptionType[T];
  autocomplete?: AutocompleteHandler;
}
type Options = Record<string, Option>;

type ValueFromOption<T extends Option> = T['choices'] extends Choices
  ? ValueFromChoices<T['choices']>
  : CommandOptionType[T['type']];
export type OptionValue<T extends Option = Option> =
  T['default'] extends CommandOptionType[Type]
    ? ValueFromOption<T>
    : T['optional'] extends true
    ? ValueFromOption<T> | undefined
    : ValueFromOption<T>;

type Handler<T extends Options = Options> = (
  i: ChatInputCommandInteraction,
  options: {
    [K in keyof T]: OptionValue<T[K]>;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
) => any | Promise<any>;

interface CommandOptions<T extends Options> {
  desc: string;
  options: T;
}
export interface Command<T extends Options = Options>
  extends CommandOptions<T> {
  handler: Handler<T>;
}
export type Commands = Record<string, Command>;
export type CommandGroups = Record<string, Commands>;

const command = <T extends Options>(
  options: CommandOptions<T>,
  handler: Handler<T>
): Command<T> => ({ ...options, handler });
export default command;

let buildCount = 0;

export async function deploy(
  commands: Commands | CommandGroups,
  token: string,
  applicationId: string
) {
  const rest = new REST({ version: '10' }).setToken(token);

  buildCount = 0;
  const data = Object.entries(commands).map(([name, command]) =>
    typeof command.desc === 'string'
      ? build(name, command as Command)
      : typeof Object.values(command as Commands | CommandGroups)[0].desc ===
        'string'
      ? {
          name,
          description: name,
          options: Object.entries(command as Commands).map(
            ([name, command]) => ({
              type: ApplicationCommandOptionType.Subcommand,
              ...build(name, command)
            })
          )
        }
      : {
          name,
          description: name,
          options: Object.entries(command as CommandGroups).map(
            ([name, command]) => ({
              type: ApplicationCommandOptionType.SubcommandGroup,
              name,
              description: name,
              options: Object.entries(command as Commands).map(
                ([name, command]) => ({
                  type: ApplicationCommandOptionType.Subcommand,
                  ...build(name, command)
                })
              )
            })
          )
        }
  );

  await rest.put(Routes.applicationCommands(applicationId), {
    body: data
  });
  return buildCount;
}

const commandOptionTypeMap: Record<
  keyof CommandOptionType,
  ApplicationCommandOptionType
> = {
  string: ApplicationCommandOptionType.String,
  int: ApplicationCommandOptionType.Integer,
  float: ApplicationCommandOptionType.Number,
  bool: ApplicationCommandOptionType.Boolean,
  choice: ApplicationCommandOptionType.String,
  user: ApplicationCommandOptionType.User,
  channel: ApplicationCommandOptionType.Channel,
  attachment: ApplicationCommandOptionType.Attachment
};

function build(name: string, { desc, options }: Command) {
  buildCount++;
  return {
    name,
    description: desc,
    options: Object.entries(options).map(
      ([
        name,
        { desc, type, min, max, optional, default: d, choices, autocomplete }
      ]) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const data: any = {
          name,
          type: commandOptionTypeMap[type],
          description: desc,
          min_value: min,
          max_value: max,
          required: !optional && d === undefined,
          choices:
            type === 'choice'
              ? Array.isArray(choices)
                ? choices.map(choice => ({
                    name: choice,
                    value: choice
                  }))
                : Object.entries(choices || {}).map(([name, description]) => ({
                    name,
                    description,
                    value: name
                  }))
              : undefined,
          autocomplete: !!autocomplete
        };
        if (type === 'int' || type === 'float') {
          data.min_value = min;
          data.max_value = max;
        } else if (type === 'string') {
          data.min_length = min;
          data.max_length = max;
        }
        return data;
      }
    )
  };
}
