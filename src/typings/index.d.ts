import { ColorResolvable, SlashCommandBuilder } from 'discord.js';
import { Events } from 'discord.js';

//Client config

export type ObjectNameIDArray = Array[{ name?: string; id: string }];

export interface ClientConfigInterface {
  TOKEN: string;
  CLIENT_ID: string;

  errorHandling: boolean;
  applicationName: string;
  database?: {
    MongoDB: string;
    Redis?: string;
  };
  webhooks?: Object[string];
  APIs?: Object[Object[string]];
  devGuilds?: ObjectNameIDArray;
  developers?: ObjectNameIDArray;
  colors?: Object[ColorResolvable];
  embeds?: Object[(...args: any[]) => any];
}

//Slashcommands

export interface SlashCommandInterface {
  data: SlashCommandBuilder | any;
  cooldown?: string;
  execute: (...args: any[]) => any;
}

//Client Events
interface EventOptions {
  ONCE?: boolean;
  REST?: boolean;
}

export interface ClientEventInterface {
  name: Events;
  options?: EventOptions;
  execute: (...args: any[]) => any;
}
