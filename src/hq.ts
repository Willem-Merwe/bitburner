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

export const hack = 'hack.ts'
export const weaken = 'weaken.ts'
export const grow = 'grow.ts'
export const share = 'share.ts'

export async function main(ns: NS): Promise<void> {
    // Step 1
    const servers = getServers(ns)

    // Step 2
    rootkit(ns, servers)

    // Step 3 + 4
    const targetServers = sortedServersByProfitability(ns, servers)

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
        if (ns.getServerNumPortsRequired(server) <= getPortHackCount(ns)) {
            if (ns.fileExists("BruteSSH.exe")) { ns.brutessh(server) }
            if (ns.fileExists("FTPCrack.exe")) { ns.ftpcrack(server) }
            if (ns.fileExists("relaySMTP.exe")) { ns.relaysmtp(server) }
            if (ns.fileExists("HTTPWorm.exe")) { ns.httpworm(server) }
            if (ns.fileExists("SQLInject.exe")) { ns.sqlinject(server) }
            ns.nuke(server)
        }

        ns.scp(hack, server, "home")
        ns.scp(weaken, server, "home")
        ns.scp(grow, server, "home")
        ns.scp(share, server, "home")

    })
}

// get the current number of available port hacks
const getPortHackCount = (ns: NS) => {
    let count = 0;
    if (ns.fileExists("BruteSSH.exe")) {count++}
    if (ns.fileExists("FTPCrack.exe")) {count++}
    if (ns.fileExists("relaySMTP.exe")) {count++}
    if (ns.fileExists("HTTPWorm.exe")) {count++}
    if (ns.fileExists("SQLInject.exe")) {count++}
    return count
}

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
   
const sortedServersByProfitability = (ns: NS, servers: string[]): string[] => {
    const sortedServers = []
    servers.forEach((server) => {
        if (ns.getServerRequiredHackingLevel(server) < ns.getHackingLevel()) {
            const x = 0
        }
    })
    return ['']
}