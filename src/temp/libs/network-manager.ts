import { NS, Server } from '@ns'
import { getCurrentNumberOfHackablePorts, rootTarget, setupTarget } from '/temp/libs/rootkit'

export class NetworkManager {
    private servers: Server[]
    private netscript: NS

    constructor(ns: NS) {
        this.netscript = ns
        this.servers = this.createServerList()
    }

    private update() {
        for (let i = 0; i < this.servers.length; i++) {
            const currentHackablePorts = getCurrentNumberOfHackablePorts(this.netscript)
            const reqPorts = this.servers[i].numOpenPortsRequired || 0
            if (!this.servers[i].hasAdminRights && reqPorts <= currentHackablePorts) {
                rootTarget(this.netscript, this.servers[i].hostname)
            }
            setupTarget(this.netscript, this.servers[i].hostname)
            this.servers[i] = this.netscript.getServer(this.servers[i].hostname)
        }
    }

    private createServerList = () => {
        const foundServers = new Set([`home`]);
        for (const server of foundServers) this.netscript.scan(server).forEach(adjacentServer => foundServers.add(adjacentServer));
        return [...foundServers].sort().map((server) => {return this.netscript.getServer(server)});
    }

    private getServers = (): Server[] => {
        this.update()
        return this.servers
    }

    // Servers that are potential Targets for our hacks
    public getHackableServers = (): Server[] => {
        this.update()
        const hackerLevel = this.netscript.getHackingLevel()       
        const servers: Server[] = []
        this.servers.filter((server) => server.hostname !== 'home').forEach((server) => {
            const requiredHackingSkill = server.requiredHackingSkill || 0
            if ( requiredHackingSkill <= hackerLevel ) {
                servers.push(server)
            }
        })

        return servers
    }

    // Servers that could be used to Hack FROM
    public getResourceServers = (): Server[] => {
        this.update()
        return this.servers.filter((server) => server.hasAdminRights && server.hasAdminRights && server.maxRam > 0)
    }
}

export async function main(ns: NS): Promise<void> {
    const networkManager = new NetworkManager(ns)
    ns.tprint(networkManager.getResourceServers())
  }
  