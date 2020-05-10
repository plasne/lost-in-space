import { Action } from './Action';

export abstract class Station {
    private _action1?: Action = undefined;
    private _action2?: Action = undefined;
    private _action3?: Action = undefined;

    abstract prefix: string;

    public get action1(): Action | undefined {
        return this._action1;
    }
    public set action1(value: Action | undefined) {
        this._action1 = value;
    }

    public get action2(): Action | undefined {
        return this._action2;
    }
    public set action2(value: Action | undefined) {
        this._action2 = value;
    }

    public get action3(): Action | undefined {
        return this._action3;
    }
    public set action3(value: Action | undefined) {
        this._action3 = value;
    }

    public tick() {
        // let the actions do what they do
        if (this.action1) this.action1.tick();
        if (this.action2) this.action2.tick();
        if (this.action3) this.action3.tick();
    }

    public click(action: string) {
        if (action === 'action1' && this.action1) this.action1.activate();
        if (action === 'action2' && this.action2) this.action2.activate();
        if (action === 'action3' && this.action3) this.action3.activate();
    }
}
