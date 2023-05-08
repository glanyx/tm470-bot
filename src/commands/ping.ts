import { SlashCommandBuilder } from "discord.js"

const data = new SlashCommandBuilder()
  .setName('ping')
  .setDescription('Ping pong!')

export class Ping {

  public static data = data

}