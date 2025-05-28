import { z } from 'zod/v4';

const DiscordStatusesSchema = z.enum(['online', 'idle', 'dnd', 'offline'])

const DiscordStatuses = DiscordStatusesSchema.enum

const DiscordUserSchema = z.object({
  userId: z.string(),
  statusToHttpResponseCodeMap: z.record(DiscordStatusesSchema, z.number()).default({
    online: 200,
    idle: 200,
    dnd: 200,
    offline: 502
  }),
  comment: z.string().optional()
})

const ConfigSchema = z.object({
  discordToken: z.string(),
  discordGuildId: z.string().optional(),
  discordUsers: z.record(z.string(), DiscordUserSchema),
})

const parseConfig = async (data: any) => {
  const parsed = ConfigSchema.parse(data)
  return parsed
}

export const resolveConfig = async (path: string = "./discord_uptime.toml") => {
  const file = Bun.file(path)
  const content = await file.text()
  const data = Bun.TOML.parse(content)
  const parsed = await parseConfig(data)
  return parsed
}