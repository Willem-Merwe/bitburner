import { NS } from "@ns";

export async function main(ns: NS): Promise<void> {
  await ns.grow(String(ns.args[0]))
}
