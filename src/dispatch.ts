import { NS, PortData } from "@ns";

export async function main(ns: NS): Promise<void> {
  // eslint-disable-next-line no-constant-condition
  while(true) {
    const rawPortData: PortData = ns.readPort(0)
    const {host, target, action, threads} = JSON.parse(String(rawPortData))
    const pid = ns.exec(action, host, threads, target)
    ns.tryWritePort

  }
}
