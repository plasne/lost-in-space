import { Effects } from './Effects';
import { Reactor } from './Reactor';
import { Engine } from './Engine';
import { JumpEngine } from './JumpEngine';
import { TcpServer } from 'tcp-comm';
import { Helm } from './Helm';
import { Thrusters } from './Thrusters';
import { BoosterAction } from './Action';

export declare interface Ship {
    on(event: 'message', listener: (payload: any) => void): this;
}

export class Ship {
    private _server: TcpServer;
    private _class: number = 2;

    public effects: Effects = new Effects();
    public helm: Helm;
    public reactor: Reactor;
    public engine: Engine;
    public jumpEngine: JumpEngine;
    public thrusters: Thrusters;

    get server(): TcpServer {
        return this._server;
    }

    get class(): number {
        return this._class;
    }

    get emit(): number {
        return this.effects.sum('emit') + this.class * 10;
    }

    public tick() {
        // decrement all effect lifetimes
        this.effects.decrement('lifetime', 1, true);

        // tick the subsystems
        this.reactor.tick();
        this.engine.tick();
        this.jumpEngine.tick();
        this.thrusters.tick();

        // send updates after each tick
        this.helm.toInterface();
    }

    constructor(server: TcpServer) {
        this._server = server;

        // instantiate stations
        this.helm = new Helm(this);
        this.helm.action1 = new BoosterAction(this);

        // instantiate systems
        this.reactor = new Reactor(this);
        this.engine = new Engine(this);
        this.jumpEngine = new JumpEngine(this);
        this.thrusters = new Thrusters(this);

        // every 10 seconds: tick()
        setInterval(() => {
            this.tick();
        }, 10000);
    }
}
