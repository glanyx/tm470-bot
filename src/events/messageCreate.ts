import { Client, Message } from 'discord.js'

export class MessageCreate {

  public static async execute(client: Client, message: Message) {

    if (message.author.bot) return

    if (message.content.toLowerCase().startsWith('ping')) {
      message.reply('Pong!')
    }
    
  }

}