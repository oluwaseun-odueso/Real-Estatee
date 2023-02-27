import { CustomSeller } from "../custom";

// export {};

declare global {
    declare namespace Express {
        export interface Request {
            seller?: CustomSeller | undefined
        }
    }
}