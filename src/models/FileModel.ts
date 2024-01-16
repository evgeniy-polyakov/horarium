import {IFileLoader} from "@/models/IFileLoader";
import {FileLoaders} from "@/models/FileLoaders";
import {EditMode} from "@/models/EditMode";
import {TableSelection} from "@/models/TableSelection";

let FileModelId = 0;

export class FileModel {

    readonly id = ++FileModelId;
    readonly filename: string;
    readonly extension: string;
    readonly loader: IFileLoader;

    public textContent = "";
    public selected = false;

    public editMode: EditMode = EditMode.Table;
    readonly cellSelection = new TableSelection();

    constructor(private readonly file?: File) {
        this.filename = file?.name ?? "untitled.csv";
        this.extension = this.filename.replace(/^.*\.(\w+)$/, '$1').toLowerCase();
        this.loader = FileLoaders.filter(it => it.extension === this.extension)[0];
        if (!this.loader) {
            throw new Error(`Unknown file extension ${this.filename}`);
        }
    }

    async load() {
        if (this.file) {
            this.textContent = await this.loader.load(this.file);
        }
    }

    async save() {
        await this.loader.save(this.textContent, this.filename);
    }
}