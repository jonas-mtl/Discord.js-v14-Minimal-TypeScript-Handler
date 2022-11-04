import { ClientEventInterface } from '../../typings/index';
import { Events, ActivityType } from 'discord.js';

const event: ClientEventInterface = {
  name: Events.ClientReady,
  execute: (client) => {
    client.user?.setPresence({
      activities: [
        {
          name: `Discord.js V14`,
          type: ActivityType.Playing,
        },
      ],
      status: 'online',
    });
  },
};

export default event;
