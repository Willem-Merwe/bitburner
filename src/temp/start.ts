import { NS } from '@ns'

export const hack = 'temp/hack.js'
export const weaken = 'temp/weaken.js'
export const grow = 'temp/grow.js'

export async function main(ns: NS): Promise<void> {
    // const targets = 'foodnstuff'
    // const servers = getServers(ns)
    // const availableTargetServers = setupServers(ns, servers)

    // if( ns.getServerSecurityLevel(server) > ns.getServerMinSecurityLevel(server)) {
    //     dispatch(ns, weaken, availableTargetServers)
    // } else if (ns.getServerMoneyAvailable(server) < ns.getServerMaxMoney(server)) {
    //     dispatch(ns, grow, availableTargetServers)
    // } 

    // ns.tprint(targets)
    // ns.tprint(servers)
    // ns.tprint(availableTargetServers)
    

    // // eslint-disable-next-line no-constant-condition
    // while(true) {
    //     const availableResourcesRaw = getAvailableResources(ns, targets)
    //     let availableResources = 0

    //     availableResourcesRaw.forEach((resource) => {
    //         availableResources += resource.free
    //     })
        
    //     targets.forEach((server) => {
    //         if( ns.getServerSecurityLevel(server) > ns.getServerMinSecurityLevel(server)) {
    //             dispatch(ns, weaken, availableTargetServers)
    //         } else if (ns.getServerMoneyAvailable(server) < ns.getServerMaxMoney(server)) {
    //             dispatch(ns, grow, availableTargetServers)
    //         } 

    //     })
    // }


    
    // List of ALL servers
    const servers = getServers(ns)

    // List of Servers that have our Hacking scripts on them.
    const hackNetwork = setupServers(ns, servers, batchCost)



    const target = await ns.prompt("Select your target", {type: "text"}) as string

    prepServer(ns, target, hackNetwork)
    attack(ns, target, hackNetwork)
    
}

const prepServer = (ns: NS, target: string, hackNetwork: string[]) => {
    const minSecurity = ns.getServerMinSecurityLevel(target)
    const currentSecurity = ns.getServerSecurityLevel(target)

    const maxMoney = ns.getServerMaxMoney(target)
    const currentMoney = ns.getServerMoneyAvailable(target)

    if(minSecurity < currentSecurity) {
        // do weaken
    }

    if (currentMoney < maxMoney) {
        // do grow
    }
}

const attack = (ns: NS, target: string, hackNetwork: string[]) => {

        // ============ RAM COST CALCULATION ================
        const hackCost = ns.getScriptRam(hack, 'home')
        const growCost = ns.getScriptRam(grow, 'home')
        const weakenCost = ns.getScriptRam(weaken, 'home')
    
        const hackThreadMultiplier = 1
        const growThreadMultiplier = 10
        const weakenThreadMultiplier = 2
    
        const batchCost = hackCost + (growCost*10) + (weakenCost*2)        
        // =========== DELAY CALCULATION =================
        const baseDelay = 200

        const hackTime = ns.getHackTime(target)
        const growTime = ns.getGrowTime(target)
        const weakenTime = ns.getWeakenTime(target)
    
        const hackDelay = (weakenTime-hackTime)-baseDelay
        const weakenHackDelay = 0
        const growDelay = (weakenTime-growTime)+baseDelay
        const weakenGrowDelay = baseDelay+baseDelay
        // =================================
    
        hackNetwork.forEach((server) => {
            const freeRam = ns.getServerMaxRam(server) - ns.getServerUsedRam(server)
            const batchSets = Math.floor(freeRam/batchCost)

            if (batchSets > 0) {
                ns.exec(hack, server, (batchSets*hackThreadMultiplier), target, hackDelay)
                ns.exec(weaken, server, batchSets, target, weakenHackDelay)
                ns.exec(grow, server, (batchSets*hackThreadMultiplier), target, growDelay)
                ns.exec(weaken, server, batchSets, target, weakenGrowDelay)
            }
        })
}

// Requires a script that handles deployment
// Requires a script that prepares the server for best results
// Ratio is difficult to calculate, depends on the server, and changes with your hacking level

// 1 part to the hack scripts
// 10 parts to the grow scripts
// 2 parts to the weaken scripts

const dispatch = (ns: NS, action: string, availableServers: string[]) => {

    let totalRamAvailable = 0
    availableServers.forEach((server) => {
        totalRamAvailable += ns.getServerMaxRam(server)-ns.getServerUsedRam(server)
    })

    switch(action) {
        case hack: {
            
            break
        }
        
        case grow: {

            break
        }
        
        case weaken: {

            break
        }

    }
    
}


interface AvailableResources {
    host: string
    free: number
}

const getAvailableResources = (ns: NS, servers: string[]): AvailableResources[] => {
    const availableResources: AvailableResources[] = []
    servers.forEach((server) => {
        availableResources.push({host: server, free: (ns.getServerMaxRam(server) - ns.getServerUsedRam(server))})
    })
    return availableResources
}

const getServers = (ns: NS) => {
    const foundServers = new Set([`home`]);
    for (const server of foundServers) ns.scan(server).forEach(adjacentServer => foundServers.add(adjacentServer));
    return [...foundServers].sort();
}

const getCurrentNumberOfHackablePorts = (ns: NS) => {
    let count = 0
    if(ns.fileExists("FTPCrack.exe")) { count++ }
    if(ns.fileExists("BruteSSH.exe")) { count++ }
    if(ns.fileExists("relaySMTP.exe")) { count++ }
    if(ns.fileExists("HTTPWorm.exe")) { count++ }
    if(ns.fileExists("SQLInject.exe")) { count++ }

    return count
}

const rootkit = (ns: NS, target: string) => {
    if(ns.fileExists("FTPCrack.exe")) { ns.ftpcrack(target) }
    if(ns.fileExists("BruteSSH.exe")) { ns.brutessh(target) }
    if(ns.fileExists("relaySMTP.exe")) { ns.relaysmtp(target) }
    if(ns.fileExists("HTTPWorm.exe")) { ns.httpworm(target) }
    if(ns.fileExists("SQLInject.exe")) { ns.sqlinject(target) }
    ns.nuke(target)
}

const setupServers = (ns: NS, servers: string[], totalCost: number) => {
    const hackNetwork: string[] = []
    servers.forEach((server) => {
        const serverMaxRam = ns.getServerMaxRam(server)
        const serverHasRootAccess = ns.hasRootAccess(server)
        const reqPorts = ns.getServerNumPortsRequired(server)
        const hackablePorts = getCurrentNumberOfHackablePorts(ns)

        if (!serverHasRootAccess) {
            if (reqPorts <= hackablePorts) {
                rootkit(ns, server)
            }
        }

        if ( serverMaxRam >= totalCost) {
            ns.scp([hack, grow, weaken], server, 'home')
            hackNetwork.push(server)
        }
    })

    return hackNetwork
}