import { NS } from '@ns'

export async function main(ns: NS): Promise<void> {
    let counter = 1
    let timestamp = new Date()
    ns.tprint("Launching Logger.js")
    // eslint-disable-next-line no-constant-condition
    while (true) {
        if (ns.peek(3) !== 'NULL PORT DATA') {
            const rawPortData = ns.readPort(3)
            const {action, threads, constant} = JSON.parse(String(rawPortData))
            const actionTimestamp = new Date()
            const difference = actionTimestamp.getTime()-timestamp.getTime()
            ns.tprint("Action: ", action, "num " , constant, " Threads: ", threads, " Timestamp: ", difference+"ms")
            timestamp = actionTimestamp
            if(counter === 4) {
                ns.tprint("-------------------------------")
                counter = 1
            } else {
                counter++
            }
        } else {
            await ns.sleep(0)
        }
    }
}