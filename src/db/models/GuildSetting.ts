import { DBModel } from '../db-model'

interface IGuildSetting extends INewGuildSetting {
  id: number
  mutedRoleId: string
  logChannelId: string
}

interface INewGuildSetting {
  guildId: string
}

const collection = 'guildsettings'

export class GuildSetting extends DBModel<IGuildSetting> {

  public collection = collection

  public static async add(guildId: string) {
    return super.create<GuildSetting>(`
      INSERT INTO ${collection} ("guildId")
      SELECT '${guildId}'
      WHERE NOT EXISTS (
        SELECT 1 FROM ${collection} WHERE "guildId" = '${guildId}'
      )
    `, GuildSetting)
  }

  public async update() {
    return super.edit<GuildSetting>(`
      UPDATE ${collection} SET
        "mutedRoleId" = ${this.data.mutedRoleId ? `'${this.data.mutedRoleId}'` : null},
        "logChannelId" = ${this.data.logChannelId ? `'${this.data.logChannelId}'` : null}
      WHERE "guildId" = '${this.data.guildId}'
    `, GuildSetting)
  }

  public static async fetchByGuildId(guildId: string) {
    return super.fetchOne<GuildSetting>(`
      SELECT * FROM ${collection}
      WHERE "guildId" = '${guildId}'
    `, GuildSetting)
  }

  public get id() {
    return this.data.id
  }

  public get guildId() {
    return this.data.guildId
  }
  
  public get mutedRoleId() {
    return this.data.mutedRoleId
  }

  public setMutedRoleId(mutedRoleId: string) {
    this.data.mutedRoleId = mutedRoleId
    return this
  }
  
  public get logChannelId() {
    return this.data.logChannelId
  }

  public setLogChannelId(logChannelId: string) {
    this.data.logChannelId = logChannelId
    return this
  }
  
}