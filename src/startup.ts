import { NS } from '@ns'

export const hack = 'hack.js'
export const weaken = 'weaken.js'
export const grow = 'grow.js'
export const share = 'share.js'
export const hq = 'hq.js'
export const logger = 'logger.js'
export const dispatch = 'dispatch.js'

export async function main(ns: NS): Promise<void> {
    ns.nuke("n00dles")
    ns.nuke("foodnstuff")

    ns.scp([hq, dispatch], "foodnstuff", "home")
    ns.exec(hq, 'foodnstuff')
    ns.exec(dispatch, 'foodnstuff')
    ns.exec(logger, 'home')
}


// ┗ home
//   ┃   Root Access: YES, Required hacking skill: 1
//   ┃   Number of open ports required to NUKE: 5
//   ┃   RAM: 8.00GB
//   ┣ n00dles
//   ┃     Root Access: NO, Required hacking skill: 1
//   ┃     Number of open ports required to NUKE: 0
//   ┃     RAM: 4.00GB
//   ┣ foodnstuff
//   ┃     Root Access: NO, Required hacking skill: 1
//   ┃     Number of open ports required to NUKE: 0
//   ┃     RAM: 16.00GB