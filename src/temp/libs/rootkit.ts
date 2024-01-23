import { NS } from "@ns"

export const hack = 'temp/hack.js'
export const weaken = 'temp/weaken.js'
export const grow = 'temp/grow.js'

export const getCurrentNumberOfHackablePorts = (ns: NS) => {
    let count = 0
    if (ns.fileExists("FTPCrack.exe")) { count++ }
    if (ns.fileExists("BruteSSH.exe")) { count++ }
    if (ns.fileExists("relaySMTP.exe")) { count++ }
    if (ns.fileExists("HTTPWorm.exe")) { count++ }
    if (ns.fileExists("SQLInject.exe")) { count++ }

    return count
}

export const rootTarget = (ns: NS, target: string) => {
    if (ns.fileExists("FTPCrack.exe")) { ns.ftpcrack(target) }
    if (ns.fileExists("BruteSSH.exe")) { ns.brutessh(target) }
    if (ns.fileExists("relaySMTP.exe")) { ns.relaysmtp(target) }
    if (ns.fileExists("HTTPWorm.exe")) { ns.httpworm(target) }
    if (ns.fileExists("SQLInject.exe")) { ns.sqlinject(target) }
    ns.nuke(target)
}

export const setupTarget = (ns: NS, target: string) => {
    ns.scp([hack, weaken, grow], target, "home")
}