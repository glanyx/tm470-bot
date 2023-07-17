import { Client, Message, EmbedBuilder } from 'discord.js'
import { GuildSetting } from '../db/models'

export class MessageDelete {

  public static async execute(client: Client, message: Message) {
    
    if (message.author.id === client.user?.id) return

    const { guild } = message
    if (!guild) return

    const settings = await GuildSetting.fetchByGuildId(guild.id)
    if (!settings) return

    const { logChannelId } = settings

    const channel = guild.channels.cache.get(logChannelId) || await guild.channels.fetch(logChannelId)
    if (!channel) return

    const embed = new EmbedBuilder()
      .setColor('#ff0000')
      .setAuthor({
        name: `${message.author.username || 'Unknown'}#${message.author.discriminator || '0000'}`,
        iconURL: message.author.displayAvatarURL()
      })
      .setTitle(`Message Deleted`)
      .addFields({
        name: 'Channel',
        value: `${message.channel}` || 'Unable to retrieve',
        inline: true,
      }, {
        name:'Author',
        value: `${message.author}` || 'Unable to retrieve',
        inline: true,
      })
      .setTimestamp()

    if (message.content) {
      embed.setDescription(message.content)
    }

    if (message.attachments.size > 0) {
      [...message.attachments.values()].forEach((attachment, index) => {
        embed.addFields({ name: `Attachment ${index + 1}`, value: attachment.url })
      })
    }

    if (!message.content && message.attachments.size === 0) embed.setDescription('Unable to retrieve content')

    if (channel.isTextBased()) channel.send({ embeds: [embed] })

  }

}