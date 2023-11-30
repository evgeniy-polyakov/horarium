import {IFileLoader} from "@/models/IFileLoader";

export class TextFileLoader implements IFileLoader {

    constructor(readonly extension: string,
                readonly mimeType: string) {
    }

    async load(file: File) {
        const contents = await new Promise<string>(r => {
            const reader = new FileReader();
            reader.addEventListener('load', (event) => {
                r(event.target?.result as string);
            });
            reader.readAsText(file);
        });
        if (!contents) {
            throw new Error(`Cannot read file ${file.name}`)
        }
        return contents;
    }

    async save(contents: string, fileName: string) {
        const a = document.createElement('a');
        const url = URL.createObjectURL(new Blob([contents], {type: this.mimeType}));
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
}