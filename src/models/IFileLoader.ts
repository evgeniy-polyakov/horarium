export interface IFileLoader {
    readonly extension: string;
    readonly mimeType: string;
    load(file: File): Promise<string>;
    save(contents: string, fileName: string): Promise<void>;
}