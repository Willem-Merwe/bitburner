import { NS } from "@ns";

export async function main(ns: NS): Promise<void> {
    ns.exec('scripts/logger.js', 'home')
    ns.exec('scripts/dispatch.js', 'home')
    ns.exec('scripts/hq.js', 'home')
}
