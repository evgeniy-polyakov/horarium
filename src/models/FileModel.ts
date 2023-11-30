import {IFileLoader} from "@/models/IFileLoader";
import {FileLoaders} from "@/models/FileLoaders";

export class FileModel {

    readonly filename: string;
    readonly extension: string;
    readonly loader: IFileLoader;

    constructor(private readonly file: File) {
        this.filename = file.name;
        this.extension = file.name.replace(/^.*\.(\w+)$/, '$1').toLowerCase();
        this.loader = FileLoaders.filter(it => it.extension === this.extension)[0];
        if (!this.loader) {
            throw new Error(`Unknown file extension ${this.filename}`);
        }
    }
}