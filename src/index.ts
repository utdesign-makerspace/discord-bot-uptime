import { Elysia } from "elysia";
import { Client, Events, GatewayIntentBits } from 'discord.js';
import { resolveConfig } from "./config";
import { swagger } from '@elysiajs/swagger'

const config = await resolveConfig()

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildPresences,
	],
});

client.once(Events.ClientReady, readyClient => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
	const startDate = new Date();
  const guild = readyClient.guilds.cache.get(config.discordGuildId)
  if (!guild) {
    throw new Error("Failed to find guild")
  }
  const app = new Elysia()
    .get("/", () => {
      return { startDate, docs: '/swagger', src: 'https://github.com/utdesign-makerspace/discord-bot-uptime'}
    })
    .get("/users/:id", async ({ params, status }) => {
      const { id } = params;
      
      const userConfig = config.discordUsers[id]
      
      if (!userConfig) {
        return status(404, { error: 'User not found' });
      }
      
      const member = await guild.members.fetch({
        withPresences: true,
        user: userConfig.userId
      })
      
      const discordData = member.toJSON()
      
      const presence = member.presence?.status
      if (!presence) {
        return status(500, { error: 'Failed to fetch user status. If the user is a bot, this may be because the bot was offline when this server started.' });
      }
      
      return status(userConfig.statusToHttpResponseCodeMap[presence], {
        id, presence, checkedAt: new Date().toISOString(), userConfig, discordData
      });
    })
    .use(swagger())
    .listen(config.serverPort);
  
  console.log(
    `Discord Bot Uptime server is running at ${app.server?.hostname}:${app.server?.port} - view documentation at ${app.server!.url}swagger in your browser`
  );
});

client.login(config.discordToken);


