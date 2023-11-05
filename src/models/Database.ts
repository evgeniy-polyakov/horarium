const databaseSymbol = Symbol('database');
const tableSymbol = Symbol('table');
const idSymbol = Symbol('id');

export class Database {

    private tables: { [name: string]: Table | undefined } = {};

    constructor(...tables: Table[]) {
        for (const table of tables) {
            this.setTable(table);
        }
    }

    getTable(name: string) {
        return this.tables[name];
    }

    setTable(table: Table) {
        if (table[databaseSymbol] === this) {
            return;
        }
        if (table[databaseSymbol] !== undefined) {
            throw new Error(`Table ${table.name} belongs to another database`);
        }
        table[databaseSymbol] = this;
        this.tables[table.name] = table;
    }

    deleteTable(table: Table) {
        if (table[databaseSymbol] === this) {
            delete table[databaseSymbol];
            delete this.tables[table.name];
        }
    }
}

export class Table {

    [databaseSymbol]?: Database;
    private fields: { [name: string]: AbstractField | undefined } = {};
    private fieldsIndex: AbstractField[] = [];
    private records: { [index: number]: Record | undefined } = {};
    private recordsIndex: number[] = [];
    private index = 0;

    constructor(readonly name: string,
                ...fields: AbstractField[]) {
        for (const field of fields) {
            this.setField(field);
        }
    }

    getFields() {
        return this.fieldsIndex;
    }

    getField(name: string | number) {
        if (typeof name === 'string') {
            return this.fields[name];
        }
        return this.fieldsIndex?.[name];
    }

    setField(field: AbstractField) {
        if (field[tableSymbol] === this) {
            return;
        }
        if (field[tableSymbol] !== undefined) {
            throw new Error(`Field ${field.name} belongs to table ${field[tableSymbol].name}`);
        }
        field[tableSymbol] = this;
        if (!this.fields[field.name]) {
            this.fieldsIndex.push(field);
        }
        this.fields[field.name] = field;
    }

    get(record: number) {
        return this.records[record];
    }

    add(record: Record) {
        if (record[tableSymbol] === this) {
            return;
        }
        if (record[tableSymbol] !== undefined) {
            throw new Error(`Record ${record[idSymbol]} belongs to table ${record[tableSymbol].name}`);
        }
        record[tableSymbol] = this;
        if (record[idSymbol] !== undefined) {
            this.index = Math.max(this.index, record[idSymbol]);
        } else {
            record[idSymbol] = ++this.index;
        }
        this.records[record[idSymbol]] = record;
        this.recordsIndex.push(record[idSymbol]);
    }

    delete(record: Record | number) {
        if (typeof record === 'number') {
            const r = this.records[record];
            if (!r) {
                return;
            }
            record = r;
        } else if (record[tableSymbol] !== this) {
            return;
        }
        const i = record[idSymbol];
        if (i !== undefined) {
            delete this.records[i];
        }
        delete record[tableSymbol];
        delete record[idSymbol];
    }

    truncate() {
        for (const id of this.recordsIndex) {
            const record = this.records[id];
            if (record) {
                delete record[tableSymbol];
                delete record[idSymbol];
            }
        }
        this.records = {};
    }
}

export abstract class AbstractField<TStore extends Value = Value, TValue extends Value = TStore> {

    [tableSymbol]?: Table;

    constructor(readonly name: string) {
    }

    cast(value: Value): TValue {
        return this.parse(value) as unknown as TValue;
    }

    abstract parse(value: Value): TStore;

    stringify(value: Value): string {
        value = this.parse(value);
        return value === undefined || value === null ? '' : String(value);
    }
}

export class StringField extends AbstractField<string> {

    parse(value: Value): string {
        return value ? String(value) : '';
    }
}

export class NumberField extends AbstractField<number | undefined> {

    parse(value: Value): number | undefined {
        if (typeof value === 'number') {
            return value;
        }
        const n = parseFloat(String(value));
        return isNaN(n) ? undefined : n;
    }
}

export class BooleanField extends AbstractField<boolean> {

    parse(value: Value): boolean {
        if (value === '0') {
            return false;
        }
        return !!value;
    }

    stringify(value: Value): string {
        return value ? '1' : '0';
    }
}

export class DateField extends AbstractField<Date | undefined> {

    parse(value: Value): Date | undefined {
        if (value instanceof Date) {
            return value;
        }
        if (value === undefined || value === null) {
            return undefined;
        }
        const date = new Date(String(value));
        if (isNaN(date.valueOf())) {
            return undefined;
        }
        return date;
    }

    stringify(value: Value): string {
        const date = this.parse(value);
        if (date) {
            return date.toISOString();
        }
        return '';
    }
}

export class ReferenceField extends AbstractField<number | undefined, Record | undefined> {

    cast(value: Value): Record | undefined {
        if (value instanceof Record) {
            return value;
        }
        const id = typeof value === 'number' ? value : parseInt(String(value));
        if (isNaN(id)) {
            return undefined;
        }
        return this[tableSymbol]?.[databaseSymbol]?.getTable(this.name)?.get(id);
    }

    parse(value: Value): number | undefined {
        if (value instanceof Record) {
            return value[idSymbol];
        }
        const id = typeof value === 'number' ? value : parseInt(String(value));
        if (isNaN(id)) {
            return undefined;
        }
        return id;
    }

    stringify(value: Value): string {
        if (value instanceof Record) {
            value = value[idSymbol];
        }
        return super.stringify(value);
    }
}

export class Record {

    [idSymbol]?: number;
    [tableSymbol]?: Table;
    private values: { [name: string]: Value } = {};

    constructor(id?: number) {
        this[idSymbol] = id && isNaN(id) ? undefined : id;
    }

    get(name: string): Value {
        return this[tableSymbol]?.getField(name)?.cast(this.values[name]);
    }

    set(name: string, value: Value) {
        this.values[name] = this[tableSymbol]?.getField(name)?.parse(value);
    }
}

export type Value = string | number | boolean | Date | Record | null | undefined;