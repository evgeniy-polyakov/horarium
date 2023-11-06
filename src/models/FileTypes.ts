import {FileType} from "@/models/FileType";
import {CSVDatabase} from "@/models/CSVDatabase";

export const FileTypes = [
    new FileType('csv', 'text/csv', () => new CSVDatabase()),
    // todo support other file types
];