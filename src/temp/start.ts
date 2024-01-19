import { NS } from '@ns'

export const hack = 'temp/hack.js'
export const weaken = 'temp/weaken.js'
export const grow = 'temp/grow.js'

export async function main(ns: NS): Promise<void> {
    const targets = 'foodnstuff'
    const servers = getServers(ns)
    const availableTargetServers = setupServers(ns, servers)

    if( ns.getServerSecurityLevel(server) > ns.getServerMinSecurityLevel(server)) {
        dispatch(ns, weaken, availableTargetServers)
    } else if (ns.getServerMoneyAvailable(server) < ns.getServerMaxMoney(server)) {
        dispatch(ns, grow, availableTargetServers)
    } 

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

}

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

const setupServers = (ns: NS, servers: string[]): string[] => {
    const availableServers: string[] = []
    servers.forEach((server) => {
        if (ns.getServerNumPortsRequired(server) < 1) {
            ns.nuke(server)
            ns.scp([hack, weaken, grow], server, 'home')
            availableServers.push(server)
        }
        
    })
    return availableServers
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