import {IFileLoader} from "@/models/IFileLoader";
import {TextFileLoader} from "@/models/TextFileLoader";

export const FileLoaders: IFileLoader[] = [
    new TextFileLoader('csv', 'text/csv'),
    // todo support other file types
];