import { NS } from '@ns'

export const hack = 'hack.js'
export const weaken = 'weaken.js'
export const grow = 'grow.js'

export async function main(ns: NS): Promise<void> {
    ns.tprint("Initializing start.ts...")
    // ============ RAM COST CALCULATION ================ //
    const hackCost = ns.getScriptRam(hack, 'home')
    const growCost = ns.getScriptRam(grow, 'home')
    const weakenCost = ns.getScriptRam(weaken, 'home')

    const hackThreadMultiplier = 1
    const growThreadMultiplier = 10
    const weakenThreadMultiplier = 2

    const batchCost = (hackCost * hackThreadMultiplier) + (growCost * growThreadMultiplier) + (weakenCost * weakenThreadMultiplier)
    // =========== END RAM COST CALCULATION ================= //



    // List of ALL serverslol
    const servers = getServers(ns)

    // List of Servers that have our Hacking scripts on them.
    const hackNetwork = setupServers(ns, servers, batchCost)



    // const target = ns.args[0] as string || await ns.prompt("Select your target", { type: "text" }) as string

    hackNetwork.forEach((server) => {
        if (ns.hasRootAccess(server)) {
            if (ns.getServerMaxMoney(server) > 0) {
                try {
                    prepServer(ns, server, hackNetwork)
                    if (ns.getHackingLevel() >= ns.getServerRequiredHackingLevel(server)) {
                        attack(ns, server, hackNetwork)
                    }
                } catch (error) {
                    ns.tprint(error)
                }

            }
        }

    })

    // attack(ns, target, hackNetwork)

}

const prepServer = async (ns: NS, target: string, hackNetwork: string[]) => {
    ns.tprint("start prepServer")
    const minSecurity = ns.getServerMinSecurityLevel(target)
    const currentSecurity = ns.getServerSecurityLevel(target)

    const maxMoney = ns.getServerMaxMoney(target)
    const currentMoney = ns.getServerMoneyAvailable(target)

    if (minSecurity < currentSecurity) {
        ns.tprint('Security min < current')
        const securityDifference = currentSecurity - minSecurity
        let weakenThreads = Math.ceil(securityDifference / 0.05)
        const weakenCost = ns.getScriptRam(weaken, 'home')
        const weakenTime = ns.getWeakenTime(target)

        // while (weakenThreads > 0) {
        hackNetwork.forEach((server) => {
            const freeRam = ns.getServerMaxRam(server) - ns.getServerUsedRam(server)
            if (ns.getServerMaxRam(server) > 0) {


                if (freeRam >= weakenCost) {
                    const availableThreads = Math.floor(freeRam / weakenCost)
                    ns.tprint("freeRam: ", freeRam, " weakenCost: ", weakenCost, " availableThreads: ", availableThreads)
                    if (availableThreads > 0) {
                        if (availableThreads < weakenThreads) {
                            ns.tprint("Weaken #1")
                            ns.exec(weaken, server, availableThreads, target, 0)
                            weakenThreads -= availableThreads
                        } else if (availableThreads > weakenThreads && weakenThreads > 0) {
                            ns.exec(weaken, server, weakenThreads, target, 0)
                            ns.tprint("Weaken #2")
                            weakenThreads = 0
                        }
                    }
                }
            }
            // ns.tprint("\nTarget: " + target + "\nHackServer: " + server + "\nThreadCount: " + weakenThreads)
        })
        await ns.sleep(weakenTime * 1.01)
        // }

    } else if (currentMoney < maxMoney) {
        // do grow

    }

}

const attack = (ns: NS, target: string, hackNetwork: string[]) => {

    // ============ RAM COST CALCULATION ================ //
    const hackCost = ns.getScriptRam(hack, 'home')
    const growCost = ns.getScriptRam(grow, 'home')
    const weakenCost = ns.getScriptRam(weaken, 'home')

    const hackThreadMultiplier = 1
    const growThreadMultiplier = 10
    const weakenThreadMultiplier = 2

    const batchCost = (hackCost * hackThreadMultiplier) + (growCost * growThreadMultiplier) + (weakenCost * weakenThreadMultiplier)
    // =========== END RAM COST CALCULATION ================= //

    // =========== DELAY CALCULATION ================= //
    const baseDelay = 200

    const hackTime = ns.getHackTime(target)
    const growTime = ns.getGrowTime(target)
    const weakenTime = ns.getWeakenTime(target)

    const hackDelay = (weakenTime - hackTime) - baseDelay
    const weakenHackDelay = 0
    const growDelay = (weakenTime - growTime) + baseDelay
    const weakenGrowDelay = baseDelay + baseDelay
    // =========================================== //

    hackNetwork.forEach((server) => {
        if (ns.hasRootAccess(server)) {
            const freeRam = ns.getServerMaxRam(server) - ns.getServerUsedRam(server)
            const batchSets = Math.floor(freeRam / batchCost)

            if (batchSets > 0) {
                ns.exec(hack, server, (batchSets * hackThreadMultiplier), target, hackDelay)
                ns.exec(weaken, server, batchSets, target, weakenHackDelay)
                ns.exec(grow, server, (batchSets * hackThreadMultiplier), target, growDelay)
                ns.exec(weaken, server, batchSets, target, weakenGrowDelay)
            }
        }

    })
}

// Requires a script that handles deployment
// Requires a script that prepares the server for best results
// Ratio is difficult to calculate, depends on the server, and changes with your hacking level

// 1 part to the hack scripts
// 10 parts to the grow scripts
// 2 parts to the weaken scripts

// const dispatch = (ns: NS, action: string, availableServers: string[]) => {

//     let totalRamAvailable = 0
//     availableServers.forEach((server) => {
//         totalRamAvailable += ns.getServerMaxRam(server) - ns.getServerUsedRam(server)
//     })

//     switch (action) {
//         case hack: {

//             break
//         }

//         case grow: {

//             break
//         }

//         case weaken: {

//             break
//         }

//     }

// }


// interface AvailableResources {
//     host: string
//     free: number
// }

// const getAvailableResources = (ns: NS, servers: string[]): AvailableResources[] => {
//     const availableResources: AvailableResources[] = []
//     servers.forEach((server) => {
//         availableResources.push({ host: server, free: (ns.getServerMaxRam(server) - ns.getServerUsedRam(server)) })
//     })
//     return availableResources
// }

const getServers = (ns: NS) => {
    const foundServers = new Set([`home`]);
    for (const server of foundServers) ns.scan(server).forEach(adjacentServer => foundServers.add(adjacentServer));
    return [...foundServers].sort();
}

const getCurrentNumberOfHackablePorts = (ns: NS) => {
    let count = 0
    if (ns.fileExists("FTPCrack.exe")) { count++ }
    if (ns.fileExists("BruteSSH.exe")) { count++ }
    if (ns.fileExists("relaySMTP.exe")) { count++ }
    if (ns.fileExists("HTTPWorm.exe")) { count++ }
    if (ns.fileExists("SQLInject.exe")) { count++ }

    return count
}

const rootkit = (ns: NS, target: string) => {
    if (ns.fileExists("FTPCrack.exe")) { ns.ftpcrack(target) }
    if (ns.fileExists("BruteSSH.exe")) { ns.brutessh(target) }
    if (ns.fileExists("relaySMTP.exe")) { ns.relaysmtp(target) }
    if (ns.fileExists("HTTPWorm.exe")) { ns.httpworm(target) }
    if (ns.fileExists("SQLInject.exe")) { ns.sqlinject(target) }
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

        if (serverMaxRam >= totalCost) {
            ns.scp([hack, grow, weaken], server, 'home')
            hackNetwork.push(server)
        }
    })

    return hackNetwork
}