import { Client, Interaction } from 'discord.js'
import SlashCommands from '../commands'

export class InteractionCreate {

  public static async execute(client: Client, interaction: Interaction) {

    if (interaction.isCommand()) {

      const command = interaction.commandName.toCamelCase()
      if (!command) return

      const cmd = SlashCommands.find(acmd => acmd.name.toCamelCase() === command)

      if (!cmd) return

      console.log(`SlashCommand : ${cmd.name} executed by ${interaction.user.username}#${interaction.user.discriminator} (ID: ${interaction.user.id})`)

      cmd.run({ client, interaction })

    }

  }

}