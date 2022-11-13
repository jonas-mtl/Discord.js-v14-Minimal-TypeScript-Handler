import { ColorResolvable, EmbedBuilder } from 'discord.js';
import { ClientConfigInterface } from './typings/index';
import { DiscordClient as client } from './index.js';

export const clientConfig: ClientConfigInterface = {
  TOKEN: 'MTAyMTg1ODEwOTEyMTExMDExOA.G7UQ9p.BUbPJYtwoKuon5kKBBEVneYGqeBSGb0m9y7l7k',
  CLIENT_ID: '',

  errorHandling: true,
  applicationName: 'DevBot',
  devGuilds: [{ name: 'Dev' }],
  webhooks: { devLog: 'https://discord.com/api/webhooks/1011007221817151570/56Mj-q4xrbuIwNSgTsWtuo7CqmyaSxsqMmbrv66xAIMq6b0NXO7hZRbBCyIj4h342mln' },

  embeds: {
    standart: (content: string) => {
      return new EmbedBuilder().setDescription(content).setColor(client.config.colors.discordGrey);
    },
    error: (content?: string, err?: Error) => {
      return new EmbedBuilder()
        .setDescription(`> Hey, there was an **unexpected error, please try again!**${content && content}${err && `\n\`\`\`${err}\`\`\``}`)
        .setColor(client.config.colors.discordGrey);
    },
  },
  colors: {
    discordGrey: '#2f3136' as ColorResolvable,
    lightPurple: '#8A89C0' as ColorResolvable,
    lightGreen: '#06D6A0' as ColorResolvable,
    darkGreen: '#048A81' as ColorResolvable,
    skyBlue: '#54C6EB' as ColorResolvable,
    white: '#fff' as ColorResolvable,
  },
};
