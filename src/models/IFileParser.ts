import {Database} from "@/models/Database";

export interface IFileParser<T extends string | ArrayBuffer = string | ArrayBuffer> extends Database {
    readonly isBinary: boolean;
    parse(value: T): Promise<void>;
    stringify(): Promise<string>;
}