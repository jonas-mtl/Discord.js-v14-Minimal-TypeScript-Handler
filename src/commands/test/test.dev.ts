import { PermissionFlagsBits, SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { SlashCommandInterface } from '../../typings/index';

const command: SlashCommandInterface = {
  cooldown: '2000m',
  data: new SlashCommandBuilder()
    .setName('add-points')
    .setDescription('Add Points to a user.')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addUserOption((option) => option.setName('user').setDescription('The user you want to display the points from').setRequired(true)),

  execute: async (interaction: ChatInputCommandInteraction) => {
    console.log('s');
  },
};

export default command;
