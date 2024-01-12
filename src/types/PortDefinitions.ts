// export enum Action {
//   grow = "grow.js",
//   weaken = "weaken.js",
//   hack = "hack.js",
// }

/** @public */
interface DispatchInbound {
  host: string,
  target: string,
  action: string
  threads: number,
}

/** @public */
interface DispatchOutbound {
  host: string,
  target: string,
  action: string,
  pid: number,
}