import * as winston from 'winston';
import { Naming } from './Naming';
import { Ship } from './Ship';
import { Map } from './Map';
import { TcpServer } from 'tcp-comm';

declare global {
    namespace NodeJS {
        interface Global {
            logger: winston.Logger;
            server: TcpServer;
            naming: Naming;
            ship: Ship;
            map: Map;
            random: (min: number, max: number) => number;
        }
    }
}
