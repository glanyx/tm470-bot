import { DBModel } from '../db-model'

export enum ModeratorAction {
  BAN = 'ban',
  KICK = 'kick',
  MUTE = 'mute',
  WARN = 'warn'
}

interface INewModLog {
  userId: string
  targetId: string
  guildId: string
  action: ModeratorAction
  reason: string
  muteEnd?: Date
}

interface IModLog extends INewModLog {
  id: number
  datetime: Date
}

const collection = 'modlogs'

export class ModLog extends DBModel<IModLog> {

  public collection = collection

  public static async storeNewAction(action: INewModLog) {
    return super.create<ModLog>(`
      INSERT INTO ${collection} ("userId", "targetId", "guildId", action, reason, "muteEnd") VALUES (
        '${action.userId}',
        '${action.targetId}',
        '${action.guildId}',
        '${action.action}',
        '${action.reason}',
        ${action.muteEnd ? `to_timestamp(${action.muteEnd.getTime()} / 1000.0)` : null}
      )
    `, ModLog)
  }

  public get id() {
    return this.data.id
  }

  public get userId() {
    return this.data.userId
  }

  public get targetId() {
    return this.data.targetId
  }

  public get guildId() {
    return this.data.guildId
  }

  public get action() {
    return this.data.action
  }

  public get datetime() {
    return this.data.datetime
  }

  public get reason() {
    return this.data.reason
  }

  public get muteEnd() {
    return this.data.muteEnd
  }

}