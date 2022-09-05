import type { User, Message, Client } from 'discord.js';

export interface ArgType {
  string: string;
  int: number;
  float: number;
  bool: boolean;
  'string[]': string[];
  user: User;
}
type Type = keyof ArgType;

interface Arg<T extends Type = Type> {
  type: T;
  desc: string;
  optional?: boolean;
  default?: ArgType[T];
}
type Args = readonly Arg[];
type SubArgs = readonly Args[];

type ArgValue<T extends Arg = Arg> = T['default'] extends ArgType[Type]
  ? ArgType[T['type']]
  : T['optional'] extends true
  ? ArgType[T['type']] | undefined
  : ArgType[T['type']];

type Handler<T extends Args = Args> = (
  message: Message,
  args: {
    [I in keyof T]: ArgValue<T[I]>;
  },
  client: Client
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
) => any | Promise<any>;

interface CommandOptions<T extends Args> {
  name: string;
  aliases?: string[];
  desc: string;
  args: T;
}
export interface Command<T extends Args = Args, S extends SubArgs = SubArgs>
  extends CommandOptions<T> {
  handler: Handler<T>;
  subcommands?: {
    [K in keyof S]: Command<S[K]>;
  };
}

const command = <T extends Args, S extends SubArgs>(
  options: CommandOptions<T>,
  handler: Handler<T>,
  subcommands?: {
    [K in keyof S]: Command<S[K]>;
  }
): Command<T, S> => ({ ...options, handler, subcommands });
export default command;
