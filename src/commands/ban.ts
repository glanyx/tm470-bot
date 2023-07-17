import { PermissionFlagsBits, SlashCommandBuilder, GuildMember, GuildBasedChannel } from "discord.js"
import { SlashCommand, SlashcommandInteractionArgs } from './slashCommand'
import { GuildSetting, ModLog, ModeratorAction } from '../db/models'

const data = new SlashCommandBuilder()
  .setName('ban')
  .setDescription('Ban a user by specified User ID')
  .setDMPermission(false)
  .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
  .addStringOption(option =>
    option
      .setName('user_id')
      .setDescription('The User ID to ban.')
      .setRequired(true)
  )
  .addStringOption(option =>
    option
      .setName('reason')
      .setDescription('The reason to ban the user for.')
      .setRequired(false)
  )

export class Ban extends SlashCommand {

  public static data = data

  public static async run({
    interaction
  }: SlashcommandInteractionArgs) {

    await interaction.deferReply({ ephemeral: true })

    const { guild, member: authorMember } = interaction
    if (!guild || !authorMember) return

    const reason: string = (interaction.options.get('reason')?.value as string | undefined) || "No reason provided"
    const targetId: string = interaction.options.get('user_id')?.value as string

    const member = guild.members.cache.get(targetId) || await guild.members.fetch(targetId)
    if (!member) return interaction.editReply(`Unable to find member for ID: ${targetId}`)

    if ((authorMember as GuildMember).roles.highest.position <= member.roles.highest.position && (authorMember as GuildMember).id !== guild.ownerId) return interaction.editReply(`You don't have the required permissions to perform this action!`)

    await member.send(`You were **banned** from ${guild.name}!\nReason: ${reason}`)

    guild.members.ban(member, { reason })
      .then(() => {
        interaction.editReply(`${member} was banned.\nReason: ${reason}`)

        GuildSetting.fetchByGuildId(guild.id)
          .then(async setting => {
            if (!setting) return
            const ch: GuildBasedChannel | null = guild.channels.cache.get(setting.logChannelId) || await guild.channels.fetch(setting.logChannelId)
            if (ch && ch.isTextBased()) ch.send(`${member} was banned.\nReason: ${reason}`)
          })
          .catch(e => {
            console.log(`Unable to find guild settings for guild ${guild.id}. Error: ${e.message}`)
          })

        ModLog.storeNewAction({
          userId: (authorMember as GuildMember).id,
          targetId: member.id,
          guildId: guild.id,
          action: ModeratorAction.BAN,
          reason,
        })
          .then(() => console.log(`Kick for User ID ${member.id} stored to DB`))
          .catch(e => console.log(`Unable to store kick for User ID ${member.id} to DB.\nReason: ${e.message}`))

      })
      .catch(e => {
        interaction.editReply(`Error, ${member} was not banned from the server.\nReason:\n${e.message}`)
      })

  }

}