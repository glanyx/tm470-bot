import { GuildMemberAdd } from './guildMemberAdd'
import { GuildMemberRemove } from './guildMemberRemove'
import { GuildMemberUpdate } from './guildMemberUpdate'
import { InteractionCreate } from './interactionCreate'
import { MessageDelete } from './messageDelete'
import { MessageUpdate } from './messageUpdate'
import { Ready } from './ready'
import { UserUpdate } from './userUpdate'

export const Events = [
  GuildMemberAdd,
  GuildMemberRemove,
  GuildMemberUpdate,
  InteractionCreate,
  MessageDelete,
  MessageUpdate,
  Ready,
  UserUpdate,
]