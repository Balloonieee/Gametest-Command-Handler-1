import { World, Commands } from "mojang-minecraft"
import CommandBuilder from "../classes/builders/CommandBuilder.js";
import CommandHandler from "../classes/CommandRegistration.js"
import player from './player.js'
import database from './database.js'

class warps {
    constructor() {
        this.globalList = database.table('globalWarps')
        this.localList = database.table('localWarps')
        this.dimension = World.getDimension("overworld")
    }

    setGlobalWarp({ warpName, Player }) {
        if (!player.hasTag({ name: Player.nameTag, tag: 'staff' }))
            return Commands.run(
               `tellraw ${Player.nameTag} ${JSON.stringify({ rawtext:[ { text: '§➥§l§dWarp §8>> §8 * §cInsufficient permissions! §8*' }]})}`, 
               this.dimension
            )

        if (this.globalList.has(warpName))
            return Commands.run(
               `tellraw ${Player.nameTag} ${JSON.stringify({ rawtext:[ { text: `§➥§l§dWarp §8>> §e${warpName} §aalready exists!` }]})}`, 
               this.dimension
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

        return Commands.run(
            `tellraw ${Player.nameTag} ${JSON.stringify({ rawtext:[ { text: `§➥§l§dWarp §8>> §aset §e${warpName} §aat §e${Warp.location.x}, ${Warp.location.y}, ${Warp.location.z}`}]})}`,
            this.dimension
        )
    }

    removeGlobalWarp({ warpName, Player }) {
        if (!player.hasTag({ name: Player.nameTag, tag: 'staff' }))
            return Commands.run(
               `tellraw ${Player.nameTag} ${JSON.stringify({ rawtext:[ { text: '§➥§l§dWarp §8>> §8 * §cInsufficient permissions! §8*' }]})}`, 
               this.dimension
            )

        if (!this.globalList.has(warpName))
            return Commands.run(
               `tellraw ${Player.nameTag} ${JSON.stringify({ rawtext:[ { text: `§➥§l§dWarp §8>> §e${warpName} §adoes not exist!` }]})}`, 
               this.dimension
             )
        
        this.globalList.remove(warpName)

        return Commands.run(
            `tellraw ${Player.nameTag} ${JSON.stringify({ rawtext:[ { text: `§➥§l§dWarp §8>> §aremoved §e${warpName}`}]})}`,
            this.dimension
        )
    }

    setLocalWarp({ warpName, Player }) {
        if (!this.localList.has(Player.nameTag)) this.localList.set(Player.nameTag, [])
        let list = this.localList.get(Player.nameTag).value

        if (list.some(element => element?.name == warpName) || this.globalList.has(warpName))
            return Commands.run(
               `tellraw ${Player.nameTag} ${JSON.stringify({ rawtext:[ { text: `§➥§l§dWarp §8>> §e${warpName} §aalready exists!` }]})}`, 
               this.dimension
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

        return Commands.run(
            `tellraw ${Player.nameTag} ${JSON.stringify({ rawtext:[ { text: `§➥§l§dWarp §8>> §aadded §e${warpName} §aat §e${Warp.location.x}, ${Warp.location.y}, ${Warp.location.z} `}]})}`,
            this.dimension
        )
    }

    removeLocalWarp({ warpName, Player }) {
        if (!this.localList.has(Player.nameTag)) this.localList.set(Player.nameTag, [])

        let list = this.localList.get(Player.nameTag).value
        let warp = list.find(warp => warp?.name == warpName)

        if (!warp)
            return Commands.run(
               `tellraw ${Player.nameTag} ${JSON.stringify({ rawtext:[ { text: `§➥§l§dWarp §8>> §e${warpName} §adoes not exist!` }]})}`, 
               this.dimension
             )

        list.splice(list.indexOf(warp), 1)
        this.localList.update(Player.nameTag, list)
        
        return Commands.run(
            `tellraw ${Player.nameTag} ${JSON.stringify({ rawtext:[ { text: `§➥§l§dWarp §8>> §aremoved §e${warpName}`}]})}`,
            this.dimension
        )
    }

    warp({ warpName, Player }) {
        let warp = this.globalList.get(warpName)?.value ?? this.localList.get(Player.nameTag)?.value?.find(element => element.name == warpName)

        if (!warp)
            return Commands.run(
               `tellraw ${Player.nameTag} ${JSON.stringify({ rawtext:[ { text: `§➥§l§dWarp §8>> §e${warpName} §adoes not exist!` }]})}`, 
               this.dimension
             )

        Commands.run(`tp "${Player.nameTag}" ${warp.location.x} ${warp.location.y} ${warp.location.z}`, World.getDimension('overworld'))
        
        return Commands.run(
            `tellraw "${Player.nameTag}" ${JSON.stringify({ rawtext:[ { text: `§➥§l§dWarp §8>> §ateleported to §7${warpName}`}]})}`,
            this.dimension
        )
    }

    list({ Player }) {
        let message = `§➥        §l§8<< §aWarps §8>>   \n `

        let globalWarps = this.globalList.all() 
        let localWarps = this.localList.get(Player.nameTag)?.value 

        globalWarps?.forEach(globalWarp => message += ` §7( global ) §6${globalWarp.value.name} §e${globalWarp.value.location.x} §e${globalWarp.value.location.y} ${globalWarp.value.location.z}\n`)
       
        localWarps?.forEach(localWarp => message += ` §7( local ) §6${localWarp.name} §e${localWarp.location.x} §e${localWarp.location.y} ${localWarp.location.z}\n`)


        

        return Commands.run(
            `tellraw ${Player.nameTag} ${JSON.stringify({ rawtext:[ { text: message }]})}`,
            this.dimension
        )
    }
}

const warpManager = new warps()
export default warpManager
