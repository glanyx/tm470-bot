import { Client, Interaction } from 'discord.js'

export class InteractionCreate {

  public static async execute(client: Client, interaction: Interaction) {

    if (interaction.isCommand() && interaction.commandName.toLowerCase() === 'ping') {

      interaction.reply('Pong!')

    }

  }

}