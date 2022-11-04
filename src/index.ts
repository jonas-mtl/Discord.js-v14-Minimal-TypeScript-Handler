import {
  Client,
  Collection,
  GatewayIntentBits,
  Partials,
  version,
  ApplicationCommandDataResolvable,
  EmbedBuilder,
  Events,
  Interaction,
  CacheType,
  Awaitable,
  ClientEvents,
  WebhookClient,
} from 'discord.js';
import { SlashCommandInterface, ClientEventInterface, ClientConfigInterface, ObjectNameIDArray } from './typings/index';
import { clientConfig } from './config.js';
import { inspect } from 'util';

import { fileURLToPath, pathToFileURL } from 'url';
import path, { dirname } from 'path';
import { readdirSync } from 'fs';

import chalk from 'chalk';
import ms from 'ms';

const { Guilds, GuildMembers, GuildMessages, GuildPresences, GuildMessageReactions, DirectMessages, MessageContent } = GatewayIntentBits;
const { User, Message, GuildMember, ThreadMember, Channel, Reaction } = Partials;

export default class BaseClient extends Client {
  public slashCommands: Collection<string, SlashCommandInterface>;
  private clientEvents: Collection<string, ClientEventInterface>;
  public cooldowns: Collection<string, string>;
  public config: ClientConfigInterface;

  constructor() {
    super({
      intents: [Guilds, GuildMembers, GuildMessages, GuildPresences, GuildMessageReactions, MessageContent, DirectMessages],
      partials: [User, Message, GuildMember, ThreadMember, Channel, Reaction],
    });

    this.slashCommands = new Collection();
    this.clientEvents = new Collection();
    this.cooldowns = new Collection();
    this.config = clientConfig;
  }

  /**
   * initClient
   */
  public async initClient() {
    await this.loadCommands();
    await this.loadEvents();

    await this.loadCli();
    await this.login(this.config.TOKEN);
    if (this.config.errorHandling) await this.errorHandler();
  }

  /**
   * load & register Slash Commands
   */
  private async loadCommands() {
    let publicCommandsArray: Array<ApplicationCommandDataResolvable> = [];
    let devCommandsArray: Array<ApplicationCommandDataResolvable> = [];

    await Promise.all(
      readdirSync(`${dirname(fileURLToPath(import.meta.url))}/commands`).map(async (folder) => {
        await Promise.all(
          readdirSync(`${dirname(fileURLToPath(import.meta.url))}/commands/${folder}`)
            .filter((file) => file.endsWith('.js' || '.ts'))
            .map(async (file) => {
              const command: SlashCommandInterface = (await import(`${pathToFileURL(path.resolve(`${dirname(fileURLToPath(import.meta.url))}/commands/${folder}/${file}`))}`)).default;

              this.slashCommands.set(command.data.name, command);
              if (file.endsWith('.dev.ts') || file.endsWith('.dev.js')) {
                devCommandsArray.push(command.data.toJSON());
              } else {
                publicCommandsArray.push(command.data.toJSON());
              }
            })
        );
      })
    );

    this.on(Events.ClientReady, async () => {
      this.application?.commands.set(publicCommandsArray);

      if (this.config.devGuilds)
        this.config.devGuilds.forEach(async (guild: ObjectNameIDArray) => {
          await this.guilds.cache.get(guild.id)?.commands.set(devCommandsArray);
        });
    });

    /**
     * Command handling on interaction
     */
    this.on(Events.InteractionCreate, async (interaction: Interaction<CacheType>): Promise<Awaitable<any>> => {
      if (!interaction.isChatInputCommand()) return;
      const command: SlashCommandInterface | undefined = this.slashCommands.get(interaction.commandName);

      if (!command) {
        return interaction.reply({ embeds: [new EmbedBuilder().setColor(this.config.colors.DiscordGrey).setDescription(`> This command is **outdated**, please try again.`)], ephemeral: true });
      }

      if (command?.cooldown) {
        const currentMemberCooldown = this.cooldowns.get(`${interaction.user.id}-command-${interaction.commandName}`);
        if (!currentMemberCooldown) this.cooldowns.set(`${interaction.user.id}-command-${interaction.commandName}`, (Date.now() + ms(command.cooldown)).toString());
        else if (parseInt(currentMemberCooldown) < Date.now()) this.cooldowns.set(`${interaction.user.id}-command-${interaction.commandName}`, (Date.now() + ms(command.cooldown)).toString());
        else
          return interaction.reply({
            embeds: [
              new EmbedBuilder().setColor(this.config.colors.DiscordGrey).setDescription(`> You are on **cooldown, please try again <t:${Math.floor(parseInt(currentMemberCooldown) / 1000)}:R>**.`),
            ],
            ephemeral: true,
          });
      }
      command.execute(interaction, this);
    });
  }

  /**
   * Event loading
   */
  private async loadEvents() {
    await Promise.all(
      readdirSync(`${dirname(fileURLToPath(import.meta.url))}/events`).map(async (folder) => {
        await Promise.all(
          readdirSync(`${dirname(fileURLToPath(import.meta.url))}/events/${folder}`)
            .filter((file) => file.endsWith('.js' || '.ts'))
            .map(async (file) => {
              const event: ClientEventInterface = (await import(`${pathToFileURL(path.resolve(`${dirname(fileURLToPath(import.meta.url))}/events/${folder}/${file}`))}`)).default;

              if (event.options?.ONCE) {
                this.once(event.name as keyof ClientEvents, (...args) => event.execute(...args, this));
              } else {
                this.on(event.name as keyof ClientEvents, (...args) => event.execute(...args, this));
              }

              this.clientEvents.set(event.name, event);
            })
        );
      })
    );
  }

  /**
   * handle Errors to prevent crashes
   */
  private async errorHandler() {
    const webhook = new WebhookClient({
      url: this.config.webhooks.devLog,
    });

    const embed = new EmbedBuilder();
    this.on('error', (err): any => {
      console.log(chalk.grey(new Date().toLocaleTimeString()) + `| ${err}`);

      embed
        .setTitle('Discord API Error')
        .setURL('https://discordjs.guide/popular-topics/errors.html#api-errors')
        .setColor(this.config.colors.discordGrey)
        .setDescription(`\`\`\`${inspect(err, { depth: 0 }).slice(0, 1000)}\`\`\``)
        .setTimestamp();

      return webhook.send({ embeds: [embed] });
    });

    process.on('unhandledRejection', (reason, promise) => {
      console.log(chalk.grey(new Date().toLocaleTimeString()) + `| ${reason}`);

      embed
        .setTitle('**Unhandled Rejection/Catch**')
        .setURL('https://nodejs.org/api/process.html#event-unhandledrejection')
        .setColor(this.config.colors.discordGrey)
        .addFields(
          {
            name: `> Reason`,
            value: `\`\`\`${inspect(reason, { depth: 0 }).slice(0, 1000)}\`\`\``,
          },
          {
            name: '> Promise',
            value: `\`\`\`${inspect(promise, { depth: 0 }).slice(0, 1000)}\`\`\``,
          }
        )
        .setTimestamp();

      return webhook.send({ embeds: [embed] });
    });

    process.on('uncaughtException', (err, origin) => {
      console.log(chalk.grey(new Date().toLocaleTimeString()) + `| ${err} \n ${origin}`);

      embed
        .setTitle('**Uncaught Exception/Catch**')
        .setColor(this.config.colors.discordGrey)
        .setURL('https://nodejs.org/api/process.html#event-uncaughtexception')
        .addFields(
          {
            name: `> Error`,
            value: `\`\`\`${inspect(err, { depth: 0 }).slice(0, 1000)}\`\`\``,
          },
          {
            name: '> Origin',
            value: `\`\`\`${inspect(origin, { depth: 0 }).slice(0, 1000)}\`\`\``,
          }
        )
        .setTimestamp();

      return webhook.send({ embeds: [embed] });
    });

    process.on('uncaughtExceptionMonitor', (err, origin) => {
      console.log(chalk.grey(new Date().toLocaleTimeString()) + `| ${err} \n ${origin}`);

      embed
        .setTitle('**Uncaught Exception Monitor**')
        .setColor(this.config.colors.discordGrey)
        .setURL('https://nodejs.org/api/process.html#event-uncaughtexceptionmonitor')
        .addFields(
          {
            name: `> Error`,
            value: `\`\`\`${inspect(err, { depth: 0 }).slice(0, 1000)}\`\`\``,
          },
          {
            name: '> Origin',
            value: `\`\`\`${inspect(origin, { depth: 0 }).slice(0, 1000)}\`\`\``,
          }
        )
        .setTimestamp();

      return webhook.send({ embeds: [embed] });
    });

    process.on('warning', (warn) => {
      console.log(chalk.grey(new Date().toLocaleTimeString()) + `| ${warn}`);

      embed
        .setTitle('**Uncaught Exception Monitor Warning**')
        .setColor(this.config.colors.discordGrey)
        .setURL('https://nodejs.org/api/process.html#event-warning')
        .addFields({
          name: `> Warn`,
          value: `\`\`\`${inspect(warn, { depth: 0 }).slice(0, 1000)}\`\`\``,
        })
        .setTimestamp();

      return webhook.send({ embeds: [embed] });
    });
  }

  /**
   * Console interface print
   */
  private async loadCli() {
    const addLine = (content: string, extra?: number) => {
      return `\n│ ${content}${' '.repeat(Math.round((extra ? extra : 0) + 2 + interfaceLength - content.length))}│`;
    };

    const interfaceLength = 35;
    let interfaceString: string = '';
    interfaceString = `┌─ ${this.config.applicationName} ${this.config.errorHandling ? '- development' : ''} ${'─'.repeat(
      interfaceLength - (this.config.applicationName.length + (this.config.errorHandling ? 14 : 0))
    )}┐${addLine(' ')}`;
    interfaceString +=
      addLine(`${chalk.bold('◊ Discord.js version:')} ${version}`, 9) +
      addLine(`${chalk.bold('◊ Node.js version:')} ${process.version}`, 9) +
      addLine(` `) +
      addLine(`${chalk.hex('#8A89C0')('-- File Handler --')}`, 24) +
      addLine(` ${chalk.hex('#8A89C0')('⤷')} SlashCommands loaded: ${this.slashCommands.size}`, 24) +
      addLine(` ${chalk.hex('#8A89C0')('⤷')} Events loaded: ${this.clientEvents.size}`, 24) +
      addLine(` `);
    interfaceString += `\n└${'─'.repeat(interfaceLength + 3)}┘`;
    console.clear();
    console.log(interfaceString);
  }
}

const DiscordClient = new BaseClient();
DiscordClient.initClient();

export { DiscordClient };
