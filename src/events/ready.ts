import { Client, OAuth2Scopes, PermissionFlagsBits } from 'discord.js'
import { DBClient } from '../db'

export class Ready {

  public static async execute(client: Client) {

    console.log('Establising DB connection..')
    await DBClient.connect().then(() => {
      console.log('Successfully connected to DB!')
    })
    
    console.log(`Logged in as ${client.user?.tag}!`)

    const url = client.generateInvite({
      scopes: [
        OAuth2Scopes.Bot,
      ],
      permissions: [
        PermissionFlagsBits.Administrator,
        PermissionFlagsBits.ManageGuild,
        PermissionFlagsBits.ManageRoles,
        PermissionFlagsBits.ManageChannels,
        PermissionFlagsBits.KickMembers,
        PermissionFlagsBits.BanMembers,
        PermissionFlagsBits.ChangeNickname,
        PermissionFlagsBits.ViewChannel,
        PermissionFlagsBits.SendMessages,
        PermissionFlagsBits.ManageMessages,
        PermissionFlagsBits.EmbedLinks,
        PermissionFlagsBits.AttachFiles,
        PermissionFlagsBits.ReadMessageHistory,
        PermissionFlagsBits.UseExternalEmojis,
        PermissionFlagsBits.MuteMembers,
        PermissionFlagsBits.DeafenMembers,
        PermissionFlagsBits.MoveMembers,
      ]
    })

    console.log(`Invite me at: ${url}`)

    console.log('Now listening for events..');
  }

}