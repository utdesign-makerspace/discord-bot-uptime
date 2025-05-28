# discord-bot-uptime
Simple REST API to get presence of certain Discord users to integrate with tools for uptime monitoring.

This tool serves an API which returns different [HTTP status codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status) based on the presence (online, offline, etc) of a Discord user. We use this to keep track of [BitBot](https://github.com/utdesign-makerspace/BitBot)'s uptime on [Better Stack](https://betterstack.com). The tool is written using the Bun (alternative JavaScript runtime to Node.js), with Elysia (web framework) and Discord.js.

# Set up

## Setting up the Discord bot

Create a new application at https://discord.com/developers/applications, then configure your bot as shown in these screenshots.

Afterwards, go back to the 'Installation' tab and use the link provided in the 'Install Link' section to add the bot to your server. Once installed, retrieve the bot token to include in your config, by going to the 'Bot' tab > 'Build-A-Bot' > 'Token' > 'Reset Token'.

## Writing config file

The config file, `discord-uptime.toml`, specifies which users should have their presences accessible via API, and other application-level config. `discord-uptime.example.toml` has a sample of what a config should look like. Make a copy of this file, rename it to `discord-uptime.toml`, then make edits as desired in your newly copied file to configure your bot. The server will crash on start up if something is wrong with your config file.

## Deploying with Docker

A `Dockerfile` and Compose config have been created, so once you have your config file set up, `docker compose up -d` should get you up and running.

## Deploying and developing outside Docker

First, make sure you have [Bun](https://bun.sh) installed. This tool won't run on Node due to using Bun's TOML library (which can be swapped out trivially if desired).

Open a terminal into this directory, then run `bun install` to download dependencies. `bun run dev` will run the bot with auto restarting when you change code (helpful for development). `bun run start` will run the server without auto restarting (helpful for running on a server).