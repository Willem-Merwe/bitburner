/** 
 * 1. List of Servers
 * 2. Gain Access to those Accessible
 * 3. Of the targets that are Hackable, assertain some variable for profitable/targetability
 * 4. Sort the server list via that variable
 * 5. Scan servers for availability (Open threads)
 * 6. Calculate how many threads per action are required, as well as timing
 * 7. Dispatch host, target, threadcount, action
 * 8. Repeat 5-7 until either there are no targetable servers left, or until all the ram in the network has been used.
 * 9. If there are no targetable servers left, and there is ram leftover, assign share
 */

import { NS } from '@ns'

export const hack = 'hack.js'
export const weaken = 'weaken.js'
export const grow = 'grow.js'
export const share = 'share.js'

export async function main(ns: NS): Promise<void> {
    // Step 1
    const servers = getServers(ns)

    // Step 2
    rootkit(ns, servers)

    // Step 3 + 4
    const target = "foodnstuff"

    // while (ns.getServerMaxMoney(target) > 0) {

        attack(ns, target)
    // }
    // const targetServers = sortedServersByProfitability(ns, servers)

}

const attack = (ns: NS, target: string) => {
    const delay = 200

    const moneyAmount = 5000

    const hackThreads = Math.ceil(ns.hackAnalyzeThreads(target, moneyAmount))
    const hackSecurityIncrease = ns.hackAnalyzeSecurity(hackThreads, target)
    const weakenHackThreads = Math.ceil(hackSecurityIncrease/0.05)

    // moneyAmount = threads*1.growthRate

    const growthRate = 1+(ns.getServerGrowth(target)/100)

    const growthThreads = Math.ceil(moneyAmount/growthRate)
    const growthSecurityIncrease = ns.growthAnalyzeSecurity(growthThreads, target)
    const weakenGrowthThreads = Math.ceil(growthSecurityIncrease/0.05)

    ns.tprint("Threads: \nHack - ", hackThreads, "\nWeaken - ", weakenHackThreads, "\nGrow - ", growthThreads, "\nWeaken - ", weakenGrowthThreads)

    const hacktime = ns.getHackTime(target)
    const weakentime = ns.getWeakenTime(target)
    const growtime = ns.getGrowTime(target)

    const hackDelay = (weakentime-hacktime)-delay
    const hackWeakenDelay = 0
    const growDelay = (weakentime-growtime)+200
    const growWeakenDelay = 400

    ns.tprint("Times: \nHack - ", hacktime, "\nWeaken - ", weakentime, "\nGrow - ", growtime)

    // HWGW
    ns.writePort(1, JSON.stringify({ host: 'home', action: hack, target, delay: hackDelay, threads: 1 }))
    ns.writePort(1, JSON.stringify({ host: 'home', action: weaken, target, delay: hackWeakenDelay, threads: 1 }))
    ns.writePort(1, JSON.stringify({ host: 'home', action: grow, target, delay: growDelay, threads: 1 }))
    ns.writePort(1, JSON.stringify({ host: 'home', action: weaken, target, delay: growWeakenDelay, threads: 1 }))
}

// Returns string array of all the servers within the network.
const getServers = (ns: NS) => {
    const foundServers = new Set([`home`]);
    for (const server of foundServers) ns.scan(server).forEach(adjacentServer => foundServers.add(adjacentServer));
    return [...foundServers].sort();
}

// If admin access is reachable, open all ports and nuke
const rootkit = (ns: NS, servers: string[]) => {
    servers.forEach((server) => {
        // if (ns.getServerNumPortsRequired(server) <= getPortHackCount(ns)) {
        //     if (ns.fileExists("BruteSSH.exe")) { ns.brutessh(server) }
        //     if (ns.fileExists("FTPCrack.exe")) { ns.ftpcrack(server) }
        //     if (ns.fileExists("relaySMTP.exe")) { ns.relaysmtp(server) }
        //     if (ns.fileExists("HTTPWorm.exe")) { ns.httpworm(server) }
        //     if (ns.fileExists("SQLInject.exe")) { ns.sqlinject(server) }
        //     ns.nuke(server)
        // }

        ns.scp(hack, server, "home")
        ns.scp(weaken, server, "home")
        ns.scp(grow, server, "home")
        ns.scp(share, server, "home")

    })
}

// get the current number of available port hacks
// const getPortHackCount = (ns: NS) => {
//     let count = 0;
//     if (ns.fileExists("BruteSSH.exe")) { count++ }
//     if (ns.fileExists("FTPCrack.exe")) { count++ }
//     if (ns.fileExists("relaySMTP.exe")) { count++ }
//     if (ns.fileExists("HTTPWorm.exe")) { count++ }
//     if (ns.fileExists("SQLInject.exe")) { count++ }
//     return count
// }

// loop forever {
//     if security is not minimum {
//         determine how many threads we need to lower security to the minimum
//         find available ram for those threads
//         copy the weaken script to the server(s) with RAM
//         launch the weaken script(s)
//         sleep until weaken is finished
//     } else if money is not maximum {
//         do the same thing, but with the grow script
//     } else {
//         do the same thing, but with the hack script

// const sortedServersByProfitability = (ns: NS, servers: string[]): string[] => {
//     const sortedServers = []
//     servers.forEach((server) => {
//         if (ns.hasRootAccess(server)) {
//             if (ns.getServerRequiredHackingLevel(server) < ns.getHackingLevel()) {
//                 sortedServers.push(
//                     {
//                         server,
//                         security: ns.getServerSecurityLevel(server) - ns.getServerMinSecurityLevel(server),
//                         money: ns.getServerMaxMoney(server) - ns.getServerMoneyAvailable(server)
//                     })


//                 const currentSecurityLevel = ns.getServerSecurityLevel(server)
//                 const minSecurityLevel = ns.getServerMinSecurityLevel(server)
//                 const securityLevelDifference = currentSecurityLevel - minSecurityLevel

//                 const currentMoney = ns.getServerMoneyAvailable(server)
//                 const maxMoney = ns.getServerMaxMoney(server)

//             }
//         }

//     })
//     return ['']
// }