import { Client, OAuth2Scopes } from 'discord.js'

export class Ready {

  public static async execute(client: Client) {
    
    console.log(`Logged in as ${client.user?.tag}!`)

    const url = client.generateInvite({
      scopes: [
        OAuth2Scopes.Bot,
      ],
    })

    console.log(`Invite me at: ${url}`)

    console.log('Now listening for events..');
  }

}