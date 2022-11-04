<h1 align="center">
  <img alt="logo" src="https://media.discordapp.net/attachments/1006295421771067393/1038192261726482452/DC-TS.png?width=671&height=671" width="224px"/><br/>
  Minimalistic Discord.js v14 TypeScript Handler 
</h1>
<p align="center">Complete system for <b>Discord.js V.14</b> completely wtitten in <b>TypeScript</b> ~ Made by Jonas</p>

<p align="center">
<a href="https://github.com/JonasThierbach/Discord.js-v14-minimalistic-TsHandler/fork"><img src="https://img.shields.io/github/forks/JonasThierbach/Discord.js-v14-minimalistic-TsHandler?style=for-the-badge" alt="Fork Repo" /></a>
<a href="https://github.com/discordjs/discord.js/"><img src="https://img.shields.io/badge/discord.js-v14-blue?style=for-the-badge" alt="discord.js"></a>
<a href="https://nodejs.org/en/download/">
   <img src="https://img.shields.io/badge/node-16.16.x-brightgreen?style=for-the-badge" alt="node.js">
</a>
</p>

<p align="center">
<img src="https://img.shields.io/github/stars/JonasThierbach?style=for-the-badge" alt="Github Stars" />
<a href="https://discord.gg/uTCqcvC5Xf"><img src="https://img.shields.io/discord/989513288243097650?label=Personal%20Discord&style=for-the-badge" alt="Personal Discord" /></a>
</p>

## ⚡️ Features

- [x] Anti Crash Handler (toggable)
- [x] Slash Commands Handler
- [x] Developer commands
- [x] Cooldown option
- [x] Events Handler

> **Everything Multi-Guild ready and easy to use!**

## 📖 Screenshot

<img src="https://cdn.discordapp.com/attachments/1006295421771067393/1038198421292597299/Untitled-2.png" alt="Preview" />

## 📝 Installation Guide

- You will need to install the TypeScript compiler either globally or in your workspace to transpile TypeScript source code to JavaScript:
  - [`download Guide`](https://www.typescriptlang.org/download) — `npm install -g typescript@lastest` **Version 4.7.x +**.
- Adjust the settings in `./src/config.ts` so everything suits you:
  - to enable the crash handler use: `errorHandling: true,`
- Install all dependencies by using `npm install`
- To run the bot:
  - build first with `npm run build` / `tsc` >> start the bot with `npm run start` (to start once) / `npm run nodemon` (to restart automatically on build) - you will need to `npm install -g nodemon`

## ⚙️ Commands & Event Options

## Slash Commands:

### `Structure`

```js
cooldown?: string;
data: [SlashCommandBuilder],
execute: (interaction, client) => {}
```

| Option     | Description                                                                   | Type     | Default | Required? |
| ---------- | ----------------------------------------------------------------------------- | -------- | ------- | --------- |
| `Cooldown` | Adds an automatic cooldown in to the command. (use 1day/d, 2sec/s, 3min/m...) | `string` | none    | No        |

---

## Events:

### `Structure`

```js
name: ClientEvent;
options: {
  ONCE?: boolean,
  REST?: boolean
};
```

| Option | Description                                                               | Type   | Default | Required? |
| ------ | ------------------------------------------------------------------------- | ------ | ------- | --------- |
| `ONCE` | Specifies if the event should run only once.                              | `bool` | `false` | No        |
| `REST` | Rest parameter collects variable numbers of arguments into a single array | `bool` | `false` | No        |

---

## ⭐️ Made by Jonas#1713

### If you want to say **thank you** or/and support active development of the Handler:

- Add a **[GitHub Star](https://github.com/JonasThierbach/Discord.js-v14-minimalistic-TsHandler)** to the project.
- Please give proper credits when you use the Handler, especially if you want to edit and post to public.
- Add me on Discord pleasee _(Im alone, searching some Dev friends and someone to collab with me)_.

<a href="https://www.producthunt.com/posts/create-go-app?utm_source=badge-review&utm_medium=badge&utm_souce=badge-create-go-app#discussion-body" target="_blank"><img src="https://discord.c99.nl/widget/theme-3/783252406753689601.png" alt="Discord Profile"  /></a>

## ⚠️ License

The Minimalistic Discord.js v14 TypeScript Handler is available under the **MIT License**
