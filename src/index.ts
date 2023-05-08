import './typings/native/string.extension'

import { Client, GatewayIntentBits } from 'discord.js'
import { Events } from './events'

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ]
})

Events.forEach((event: any) => {
  const eventName = event.name.toCamelCase()
  client.on(eventName, event.execute.bind(null, client))
})

client.login(process.env.DISCORD_TOKEN)