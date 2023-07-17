import { Client, CommandInteraction, SlashCommandBuilder } from 'discord.js'

export interface SlashcommandInteractionArgs {
  client: Client,
  interaction: CommandInteraction
}

const desc = ''
const data: SlashCommandBuilder | Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup"> = new SlashCommandBuilder()

export abstract class SlashCommand {

  static description = desc
  static data = data

  public static async run({ }: SlashcommandInteractionArgs): Promise<any> { }

}