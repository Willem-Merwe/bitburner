import { NS } from '@ns'

export async function main(ns: NS, target = ns.args[0] as string, delay = ns.args[1] as number): Promise<void> {
    await ns.hack(target, {additionalMsec: delay})
}
