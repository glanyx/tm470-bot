import { PermissionFlagsBits, SlashCommandBuilder, Guild, GuildMember, GuildChannel, GuildBasedChannel } from "discord.js"
import { SlashCommand, SlashcommandInteractionArgs } from './slashCommand'
import { GuildSetting, ModLog, ModeratorAction } from '../db/models'

const MAX = 1000 * 60 * 60 * 24 * 7

const data = new SlashCommandBuilder()
  .setName('mute')
  .setDescription('Mute a user by specified User ID. Max 7 days.')
  .setDMPermission(false)
  .setDefaultMemberPermissions(PermissionFlagsBits.MuteMembers)
  .addStringOption(option =>
    option
      .setName('user_id')
      .setDescription('The User ID to mute.')
      .setRequired(true)
  )
  .addStringOption(option =>
    option
      .setName('reason')
      .setDescription('The reason to mute the user for.')
      .setRequired(false)
  )
  .addNumberOption(option => 
    option
      .setName('seconds')
      .setDescription('The amount of seconds to mute the user for.')
      .setRequired(false)
  )
  .addNumberOption(option => 
    option
      .setName('minutes')
      .setDescription('The amount of seconds to mute the user for.')
      .setRequired(false)
  )
  .addNumberOption(option => 
    option
      .setName('hours')
      .setDescription('The amount of seconds to mute the user for.')
      .setRequired(false)
  )
  .addNumberOption(option => 
    option
      .setName('days')
      .setDescription('The amount of seconds to mute the user for.')
      .setRequired(false)
  )

export class Mute extends SlashCommand {

  public static data = data

  public static async run({
    interaction
  }: SlashcommandInteractionArgs) {

    await interaction.deferReply({ ephemeral: true })

    const { guild, member: authorMember } = interaction
    if (!guild || !authorMember) return

    const reason = (interaction.options.get('reason')?.value as string | undefined) || "No reason provided"
    const targetId = interaction.options.get('user_id')?.value as string
    
    const seconds = (interaction.options.get('seconds')?.value as number | undefined) || 0
    const minutes = (interaction.options.get('minutes')?.value as number | undefined) || 0
    const hours = (interaction.options.get('hours')?.value as number | undefined) || 0
    const days = (interaction.options.get('days')?.value as number | undefined) || 0

    const sumDuration = (seconds + minutes * 60 + hours * 60 * 60 + days * 60 * 60 * 24) * 1000
    if (sumDuration === 0) return interaction.editReply('Please provide at least one value for the duration of the mute!')
    const duration = sumDuration > MAX ? MAX : sumDuration

    const member = guild.members.cache.get(targetId) || await guild.members.fetch(targetId)
    if (!member) return interaction.editReply(`Unable to find member for ID: ${targetId}`)

    if ((authorMember as GuildMember).roles.highest.position <= member.roles.highest.position && (authorMember as GuildMember).id !== guild.ownerId) return interaction.editReply(`You don't have the required permissions to perform this action!`)

    GuildSetting.fetchByGuildId(guild.id)
      .then(async setting => {

        if (!setting) return
        let { mutedRoleId } = setting

        if (!mutedRoleId) {
          const newRole = await createMutedRole(guild)
          mutedRoleId = newRole.id
          await setting.setMutedRoleId(mutedRoleId).update()
        }

        const mutedRole = guild.roles.cache.get(mutedRoleId) || await guild.roles.fetch(mutedRoleId)
        if (!mutedRole) return interaction.editReply(`There was an error muting the specified member.`)

        member.roles.add(mutedRole)
        await member.send(`You were **muted** in ${guild.name}!\nReason: ${reason}`)
        interaction.editReply(`${member} was muted.\nReason: ${reason}`)

        const ch: GuildBasedChannel | null = guild.channels.cache.get(setting.logChannelId) || await guild.channels.fetch(setting.logChannelId)
        if (ch && ch.isTextBased()) ch.send(`${member} was muted.\nReason: ${reason}`)

        const removeMutedRole = async () => {
          member.roles.remove(mutedRole)
          await member.send(`You were **unmuted** in ${guild.name}!`)
          if (ch && ch.isTextBased()) ch.send(`${member} was unmuted.`)
        }

        setTimeout(() => {
          removeMutedRole()
        }, duration)

        ModLog.storeNewAction({
          userId: (authorMember as GuildMember).id,
          targetId: member.id,
          guildId: guild.id,
          action: ModeratorAction.MUTE,
          reason,
          muteEnd: new Date(Date.now() + duration)
        })
          .then(() => console.log(`Mute for User ID ${member.id} stored to DB`))
          .catch(e => console.log(`Unable to store mute for User ID ${member.id} to DB.\nReason: ${e.message}`))

      })

  }

}

const createMutedRole = async (guild: Guild) => {

  const mutedRole = await guild.roles.create({
    name: 'Muted',
    permissions: [],
    reason: 'Automated Role Creation'
  })

  await guild.channels.fetch()
  
  guild.channels.cache.forEach(async channel => {
    mutedRole && (channel as GuildChannel).permissionOverwrites.create(mutedRole, {
      SendMessages: false,
      SendMessagesInThreads: false,
      AttachFiles: false,
      AddReactions: false,
      Speak: false
    })
  })

  return mutedRole
}