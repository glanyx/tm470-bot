import { REST, Routes } from 'discord.js'
import Commands from './commands'

const CLIENT_ID = `1104872355982999683`

const cmds = Commands.map(cmd => cmd.data.toJSON())
const rest = new REST().setToken(`${process.env.DISCORD_TOKEN}`);

const deploy = async () => {

  try {

    console.log(`Registering ${cmds.length} application commands..`)

    const route = Routes.applicationCommands(CLIENT_ID)
    const data = await rest.put(route, {
      body: cmds
    })

    console.log(`Registered ${(data as Array<any>).length} application commands.`)

  } catch (e) {
    console.log(`Error`, e)
  }

}

deploy()