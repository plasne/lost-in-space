import { Effects } from './Effects';
import { Reactor } from './Reactor';
import { Engine } from './Engine';
import { JumpEngine } from './JumpEngine';
import { TcpServer } from 'tcp-comm';
import { Helm } from './Helm';
import { Thrusters } from './Thrusters';
export declare interface Ship {
    on(event: 'message', listener: (payload: any) => void): this;
}
export declare class Ship {
    private _server;
    private _class;
    effects: Effects;
    helm: Helm;
    reactor: Reactor;
    engine: Engine;
    jumpEngine: JumpEngine;
    thrusters: Thrusters;
    readonly server: TcpServer;
    readonly class: number;
    readonly emit: number;
    tick(): void;
    constructor(server: TcpServer);
}
