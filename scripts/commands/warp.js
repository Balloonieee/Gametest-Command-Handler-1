import { world } from "mojang-minecraft"
import CommandBuilder from "../classes/builders/CommandBuilder.js";
import CommandHandler from "../classes/CommandRegistration.js"
import player from '../utils/player.js'
import warpManager from '../utils/warp.js'


const registration = new CommandBuilder()
.setName('warp')
.setAliases(['w'])
.setDescription('manage your warps!')
.setUsage([
  'warp <set | s> <warpType: string> <warpName: string>',
  'warp <remove | r> <warpType: string> <warpName: string>',
  'warp <warpName: string>',
  'warp <list l>',
])
.setCancelMessage(true)
.addInput(input => {
  return input.setName('warpname').setType('string').setDescription('namp of warp you want to warp to!').setRequired(true)
})
.addGroup(group => {
  return group.setName('list').setAliases(['s']).setDescription('retrive a list of all the warps!')
})
.addGroup(group => {
  return group.setName('set').setAliases(['s']).setDescription('set a warp!').addInput(input => {
    return input.setRequired(true).setType('string').setName('warptype')
  }).addInput(input => {
    return input.setName('warpname').setType('string').setRequired(true)
  })
})
.addGroup(group => {
  return group.setName('remove').setAliases(['r']).setDescription('remove a warp!').addInput(input => {
    return input.setRequired(true).setType('string').setName('warptype')
  }).addInput(input => {
    return input.setName('warpname').setType('string').setRequired(true)
  })
})

CommandHandler.register(registration, (interaction) => {
  const ran = interaction.command.getRanGroup() || interaction.command.getInput('warpname')

  switch(ran.getName()) {
    case "set":
      let SetWarpName = ran.getInput('warpname').getValue()
      let SetWarpType = ran.getInput('warptype').getValue()

      if(SetWarpType != 'global' && SetWarpType != 'local')
        return world.getDimension('overworld').runCommand(`tellraw "${interaction.player.nameTag}" ${JSON.stringify({ rawtext: [ { text: '§¥§l§dWarp §8>> §cWarp type must be §eGlobal §cor §eLocal§c!'}]})}`)
        
      SetWarpType == 'local' ? 
        warpManager.setLocalWarp({ warpName: SetWarpName, Player: interaction.player }) : 
        warpManager.setGlobalWarp({ warpName: SetWarpName, Player: interaction.player })
      break;

    case "remove":
      let RemoveWarpName = ran.getInput('warpname').getValue()
      let RemoveWarpType = ran.getInput('warptype').getValue()

      if(RemoveWarpType != 'global' && RemoveWarpType != 'local')
        return world.getDimension('overworld').runCommand(`tellraw "${interaction.player.nameTag}" ${JSON.stringify({ rawtext: [ { text: '§¥§l§dWarp §8>> §cWarp type must be §eGlobal §cor §eLocal§c!'}]})}`)
        
      RemoveWarpType == 'local' ? 
        warpManager.removeLocalWarp({ warpName: RemoveWarpName, Player: interaction.player }) : 
        warpManager.removeGlobalWarp({ warpName: RemoveWarpName, Player: interaction.player })
      break; 

     case "warpname":
       let warpName = ran.getValue()
       warpManager.warp({ warpName, Player: interaction.player })
       break;

     case "list":
       warpManager.list({ Player: interaction.player })
       break;

     default: 
      break;
  }
})
