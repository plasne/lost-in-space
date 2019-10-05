import * as winston from 'winston';
import { Naming } from './Naming';

declare global {
    namespace NodeJS {
        interface Global {
            logger: winston.Logger;
            naming: Naming;
        }
    }
}
