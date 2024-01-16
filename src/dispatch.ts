import { NS, PortData } from "@ns";

export async function main(ns: NS): Promise<void> {
  // eslint-disable-next-line no-constant-condition
  while (true) {
    while (ns.peek(1) !== 'NULL PORT DATA') {
      const rawPortData: PortData = ns.readPort(1)
      const { host, action, target, delay, threads } = JSON.parse(String(rawPortData))
      const pid = ns.exec(action, host, 1, target, delay, threads)
      ns.tryWritePort(2, JSON.stringify({ host, pid, target }))
    }
  }
}
