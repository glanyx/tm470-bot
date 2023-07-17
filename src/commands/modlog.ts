import { PermissionFlagsBits, SlashCommandBuilder, Guild, GuildMember, GuildChannel, GuildBasedChannel } from "discord.js"
import { SlashCommand, SlashcommandInteractionArgs } from './slashCommand'
import { ModLog, ModeratorAction } from '../db/models'

const data = new SlashCommandBuilder()
  .setName('modlog')
  .setDescription('Get moderation information for a specific user.')
  .setDMPermission(false)
  .setDefaultMemberPermissions(PermissionFlagsBits.MuteMembers)
  .addStringOption(option =>
    option
      .setName('user_id')
      .setDescription('The User ID to check logs for.')
      .setRequired(true)
  )

export class Modlog extends SlashCommand {

  public static data = data

  public static async run({
    interaction
  }: SlashcommandInteractionArgs) {

    await interaction.deferReply({ ephemeral: true })

    const { guild, member: authorMember } = interaction
    if (!guild) return interaction.editReply('Unable to fetch information at this time.')

    const targetId = interaction.options.get('user_id')?.value as string

    const { items: actions } = await ModLog.fetchByUserId(guild.id, targetId)

    interaction.editReply(actions.map(action => `Action: ${action.action}\nPerformed on <t:${Math.floor(action.datetime.getTime() / 1000)}>\nPerformed by <@${action.userId}>\nReason: ${action.reason}`).join('\n\n'))

  }

}