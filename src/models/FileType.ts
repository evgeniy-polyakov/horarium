import {IFileParser} from "@/models/IFileParser";

export class FileType<T> {

    constructor(
        readonly extension: string,
        readonly mimeType: string,
        readonly parser: () => IFileParser
    ) {
    }
}