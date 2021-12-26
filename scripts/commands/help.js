import { World, Commands } from "mojang-minecraft"
import CommandBuilder from "../classes/builders/CommandBuilder.js";
import CommandHandler from "../classes/CommandRegistration.js"

const registration = new CommandBuilder()
.setName('help')
.setAliases(['h'])
.setDescription('get help on commands!')
.setUsage(['help', 'help <command>'])
.setCancelMessage(true)
.setPrivate(false)
.addInput(input => {
  return input.setName('command').setType('string').setDescription('command name you need help on!').setRequired(false)
})

CommandHandler.register(registration, (interaction) => {
  try {
    const playerInput = interaction.command.getInput('command')?.getValue()
    
    let message = `smt\n`
    switch (playerInput == undefined || playerInput == null) {
      case true:
        const Command = CommandHandler.get(playerInput)
        message +=
        break;
      case false:
        break;
      default:
        break;
    }
  } catch(e) {
    
  }
})
