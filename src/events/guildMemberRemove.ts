import { Client, GuildMember, TextChannel, EmbedBuilder } from 'discord.js'
import { GuildSetting } from '../db/models'

export class GuildMemberRemove {

  public static async execute(_: Client, member: GuildMember) {

    const { guild } = member

    console.log(`Member Left: ${member.user.id} on Guild ${guild.id}`)

    const settings = await GuildSetting.fetchByGuildId(guild.id)
    if (!settings) return
    const { logChannelId } = settings

    if (logChannelId) {
      const channel = guild.channels.cache.get(logChannelId) || await guild.channels.fetch(logChannelId)

      if (channel) {
        await channel.fetch()

        const embed = new EmbedBuilder()
          .setTitle('Member Left')
          .setAuthor({
            name: `${member.user.username}#${member.user.discriminator}`,
            iconURL: member.user.displayAvatarURL()
          })
          .setThumbnail(member.user.displayAvatarURL())
          .setFooter({ text: `User ID: ${member.user.id}` })
          .setTimestamp()
          .setColor('#FF0000')

        if (channel.isTextBased()) {
          (channel as TextChannel).send({ embeds: [embed] })
        }
        
      }
    }
  return
  }

}