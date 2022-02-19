import { world } from "mojang-minecraft"
import CommandBuilder from "../classes/builders/CommandBuilder.js";
import CommandHandler from "../classes/CommandRegistration.js"
import player from './player.js'
import database from './database.js'

class warps {
    constructor() {
        this.globalList = database.table('globalWarps')
        this.localList = database.table('localWarps')
        this.dimension = world.getDimension("overworld")
    }

    setGlobalWarp({ warpName, Player }) {
        if (!player.hasTag({ name: Player.nameTag, tag: 'staff' }))
            return this.dimension.runCommand(
               `tellraw ${Player.nameTag} ${JSON.stringify({ rawtext:[ { text: '§➥§l§dWarp §8>> §8 * §cInsufficient permissions! §8*' }]})}`, 
            )

        if (this.globalList.has(warpName))
            return this.dimension.runCommand(
               `tellraw ${Player.nameTag} ${JSON.stringify({ rawtext:[ { text: `§➥§l§dWarp §8>> §e${warpName} §aalready exists!` }]})}`, 
            )
        
        }
