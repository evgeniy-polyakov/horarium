import {AbstractField, BooleanField, Database, DateField, NumberField, Record, ReferenceField, StringField, Table} from "@/models/Database";
import {parse} from 'csv/browser/esm';
import {IFileParser} from "@/models/IFileParser";

const fieldConstructors: { [type: string]: new (name: string) => AbstractField } = {
    string: StringField,
    number: NumberField,
    boolean: BooleanField,
    date: DateField,
    reference: ReferenceField,
};

export class CSVDatabase extends Database implements IFileParser<string> {

    readonly isBinary = false;

    async parse(csv: string) {
        return new Promise<void>((resolve, reject) => parse(csv, {
            trim: true,
            skip_empty_lines: true
        }, (err, lines) => {
            if (err) {
                reject(err);
                return;
            }
            let table: Table | undefined;
            let header: string[] | undefined;
            for (const line of lines) {
                if (line[0] === 'table') {
                    header = line;
                    table = undefined;
                } else if (header) {
                    table = new Table(line[0], ...header.slice(1).map((type, i) => {
                        const fieldConstructor = fieldConstructors[type];
                        if (fieldConstructor) {
                            return new fieldConstructor(line[i + 1]);
                        }
                        return new StringField(line[i + 1]);
                    }));
                    this.setTable(table);
                    header = undefined;
                } else if (table) {
                    const record = new Record(parseInt(line[0]));
                    table.add(record);
                    for (let i = 1; i < line.length; i++) {
                        const name = table.getField(i - 1)?.name;
                        if (name) {
                            record.set(name, line[i]);
                        }
                    }
                }
            }
            resolve();
        }));
    }

    async stringify() {
        // todo
        return '';
    }
}