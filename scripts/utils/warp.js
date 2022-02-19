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
        
        const Warp = {
            creator: Player.nameTag,
            name: warpName,
            location: {
              x: Math.floor(Player.location.x),
              y: Math.floor(Player.location.y),
              z: Math.floor(Player.location.z),
            },
        }
        
        this.globalList.set(warpName, Warp)

        return this.dimension.runCommand(
            `tellraw ${Player.nameTag} ${JSON.stringify({ rawtext:[ { text: `§➥§l§dWarp §8>> §aset §e${warpName} §aat §e${Warp.location.x}, ${Warp.location.y}, ${Warp.location.z}`}]})}`,
        )
    }

    removeGlobalWarp({ warpName, Player }) {
        if (!player.hasTag({ name: Player.nameTag, tag: 'staff' }))
            return this.dimension.runCommand(
               `tellraw ${Player.nameTag} ${JSON.stringify({ rawtext:[ { text: '§➥§l§dWarp §8>> §8 * §cInsufficient permissions! §8*' }]})}`, 
            )

        if (!this.globalList.has(warpName))
            return this.dimension.runCommand(
               `tellraw ${Player.nameTag} ${JSON.stringify({ rawtext:[ { text: `§➥§l§dWarp §8>> §e${warpName} §adoes not exist!` }]})}`, 
             )
        
        this.globalList.remove(warpName)

        return this.dimension.runCommand(
            `tellraw ${Player.nameTag} ${JSON.stringify({ rawtext:[ { text: `§➥§l§dWarp §8>> §aremoved §e${warpName}`}]})}`,
        )
    }

    setLocalWarp({ warpName, Player }) {
        if (!this.localList.has(Player.nameTag)) this.localList.set(Player.nameTag, [])
        let list = this.localList.get(Player.nameTag).value

        if (list.some(element => element?.name == warpName) || this.globalList.has(warpName))
            return this.dimension.runCommand(
               `tellraw ${Player.nameTag} ${JSON.stringify({ rawtext:[ { text: `§➥§l§dWarp §8>> §e${warpName} §aalready exists!` }]})}`, 
            )
        
        let Warp = {
            creator: Player.nameTag,
            name: warpName,
            location: {
                x: Math.floor(Player.location.x),
                y: Math.floor(Player.location.y),
                z: Math.floor(Player.location.z)
            }
        }
        
        list.push(Warp)
        this.localList.update(Player.nameTag, list)

        return this.dimension.runCommand(
            `tellraw ${Player.nameTag} ${JSON.stringify({ rawtext:[ { text: `§➥§l§dWarp §8>> §aadded §e${warpName} §aat §e${Warp.location.x}, ${Warp.location.y}, ${Warp.location.z} `}]})}`,
        )
    }

    removeLocalWarp({ warpName, Player }) {
        if (!this.localList.has(Player.nameTag)) this.localList.set(Player.nameTag, [])

        let list = this.localList.get(Player.nameTag).value
        let warp = list.find(warp => warp?.name == warpName)

        if (!warp)
            return this.dimension.runCommand(
               `tellraw ${Player.nameTag} ${JSON.stringify({ rawtext:[ { text: `§➥§l§dWarp §8>> §e${warpName} §adoes not exist!` }]})}`, 
             )

        list.splice(list.indexOf(warp), 1)
        this.localList.update(Player.nameTag, list)
        
        return this.dimension.runCommand(
            `tellraw ${Player.nameTag} ${JSON.stringify({ rawtext:[ { text: `§➥§l§dWarp §8>> §aremoved §e${warpName}`}]})}`,
        )
    }

    warp({ warpName, Player }) {
        let warp = this.globalList.get(warpName)?.value ?? this.localList.get(Player.nameTag)?.value?.find(element => element.name == warpName)

        if (!warp)
            return this.dimension.runCommand(
               `tellraw "${Player.nameTag}" ${JSON.stringify({ rawtext:[ { text: `§➥§l§dWarp §8>> §e${warpName} §adoes not exist!` }]})}`
             )

        this.dimension.runCommand(`tp "${Player.nameTag}" ${warp.location.x} ${warp.location.y} ${warp.location.z}`)
        
        return this.dimension.runCommand(
            `tellraw "${Player.nameTag}" ${JSON.stringify({ rawtext:[ { text: `§➥§l§dWarp §8>> §ateleported to §7${warpName}`}]})}`
        )
    }

    list({ Player }) {
        let message = `§➥        §l§8<< §aWarps §8>>   \n `

        let globalWarps = this.globalList.all() 
        let localWarps = this.localList.get(Player.nameTag)?.value 

        globalWarps?.forEach(globalWarp => message += ` §7( global ) §6${globalWarp.value.name} §e${globalWarp.value.location.x} §e${globalWarp.value.location.y} ${globalWarp.value.location.z}\n`)
       
        localWarps?.forEach(localWarp => message += ` §7( local ) §6${localWarp.name} §e${localWarp.location.x} §e${localWarp.location.y} ${localWarp.location.z}\n`)


        

        return this.dimension.runCommand(
            `tellraw ${Player.nameTag} ${JSON.stringify({ rawtext:[ { text: message }]})}`
        )
    }
}

const warpManager = new warps()
export default warpManager
