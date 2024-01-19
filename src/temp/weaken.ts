import { NS } from '@ns'

export async function main(ns: NS, target = ns.args[0] as string): Promise<void> {
    await ns.weaken(target)
}