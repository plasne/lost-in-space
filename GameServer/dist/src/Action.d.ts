export declare abstract class Action {
    abstract id: string;
    get isAvailable(): boolean;
    abstract activate(): void;
    tick(): void;
}
export declare class BoosterAction extends Action {
    get id(): string;
    activate(): void;
}
