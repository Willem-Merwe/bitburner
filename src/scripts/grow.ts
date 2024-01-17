import { NS } from "@ns";

export async function main(ns: NS, target = ns.args[0] as string, delay = ns.args[1] as number, threads = ns.args[2] as number): Promise<void> {
  const constant = await ns.grow(target, {additionalMsec: delay})
  ns.writePort(3, JSON.stringify({action: "grow", threads, constant}))
}
