import { Client, GuildMember, TextChannel, EmbedBuilder } from 'discord.js'
import { GuildSetting } from '../db/models'

export class GuildMemberAdd {

  public static async execute(client: Client, member: GuildMember) {

    const { guild } = member

    console.log(`New Member: ${member.user.id} on Guild ${guild.id}`)

    // Fetch settings for this guild
    const settings = await GuildSetting.fetchByGuildId(guild.id)
    if (!settings) return
    const { logChannelId } = settings

    // Send member join message to configured channel
    if (logChannelId) {
      const channel = guild.channels.cache.get(logChannelId) || await guild.channels.fetch(logChannelId)

      if (channel) {

        const embed = new EmbedBuilder()
          .setTitle('Member Joined')
          .setDescription(`${member}`)
          .setAuthor({
            name: `${member.user.username}#${member.user.discriminator}`,
            iconURL: member.user.displayAvatarURL()
          })
          .setThumbnail(member.user.displayAvatarURL())
          .setFooter({ text: `User ID: ${member.user.id}` })
          .setTimestamp()
          .setColor('#00FF00')

        if (channel.isTextBased()) {
          (channel as TextChannel).send({ embeds: [embed] })
        }
        
      }
    }

  }

}