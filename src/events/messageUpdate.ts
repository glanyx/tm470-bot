import { Client, Message, EmbedBuilder } from 'discord.js'
import { GuildSetting } from '../db/models'

export class MessageUpdate {

  public static async execute(client: Client, messageOld: Message, message: Message) {

    if (message.author.id === client.user?.id) return
    if (messageOld.content === message.content && messageOld.attachments.size === message.attachments.size) return

    const { guild, author, content, url } = message
    if (!guild) return

    console.log(`Message ID ${message.id} updated on Guild ID ${message.guild?.id}`)

    const settings = await GuildSetting.fetchByGuildId(guild.id)
    if (!settings) return

    const { logChannelId } = settings

    const channel = guild.channels.cache.get(logChannelId) || await guild.channels.fetch(logChannelId)
    if (!channel) return

    const embed = new EmbedBuilder()
      .setColor('#00dbff')
      .setAuthor({
        name: `${author.username || 'Unknown'}#${author.discriminator || '0000'}`,
        iconURL: author.displayAvatarURL()
      })
      .setTitle(`Message Edited`)
      .setDescription(`[Link](${url})`)
      .addFields({
        name: 'Author',
        value: `${author}`
      }, {
        name: 'Before',
        value: messageOld.content ? messageOld.content.length > 1024 ? `${messageOld.content.substr(0, 1022)}..` : messageOld.content : '*None*',
      }, {
        name: 'After',
        value: content ? content.length > 1024 ? `${content.substr(0, 1022)}..` : content : '*None*'
      })
      .setTimestamp()

    if (messageOld.content) embed;

    [...messageOld.attachments.values()].forEach((attachment, index) => {
      embed.addFields({ name: `Old Attachment ${index + 1}`, value: attachment.url })
    });

    [...message.attachments.values()].forEach((attachment, index) => {
      embed.addFields({ name: `New Attachment ${index + 1}`, value: attachment.url })
    });

    if (channel.isTextBased()) channel.send({ embeds: [embed] })

  }

}