import { NS } from "@ns";

interface DarkWebProgram {
    name: string
    cost: number
    owned: boolean
}

export class DarkWebProgramManager {
    private ns: NS
    private darkWebPrograms: DarkWebProgram[] = []
    private setupComplete = false

    constructor(ns: NS) {
        this.ns = ns
        if (this.ns.singularity.purchaseTor()) {
            this.setup()
            this.buyOptions()
        }
    }

    private setup = () => {
        this.ns.singularity.getDarkwebPrograms().forEach((program) => {
            this.darkWebPrograms.push({ name: program, cost: this.ns.singularity.getDarkwebProgramCost(program), owned: this.ns.fileExists(program) })
        })
        this.darkWebPrograms = this.darkWebPrograms.sort((programA, programB) => { return programB.cost - programA.cost })
        this.setupComplete = true
    }

    public buyOptions = () => {
        if (this.setupComplete) {
            this.darkWebPrograms.filter((program) => !program.owned).forEach((program) => {
                const availableMoney = this.ns.getServerMoneyAvailable('home')
                if (program.cost <= availableMoney) {
                    this.ns.singularity.purchaseProgram(program.name)
                    program.owned = true
                } else {
                    return
                }
            })
        } else {
            if (this.ns.singularity.purchaseTor()) {
                this.setup()
            }
        }
    }
}
