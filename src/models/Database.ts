const databaseSymbol = Symbol('database');
const tableSymbol = Symbol('table');
const idSymbol = Symbol('id');

export class Database {

    private tables = new Index<string, Table>();

    constructor(...tables: Table[]) {
        for (const table of tables) {
            this.setTable(table);
        }
    }

    getTables() {
        return this.tables.all();
    }

    getTable(name: string) {
        return this.tables.get(name);
    }

    setTable(table: Table) {
        if (table[databaseSymbol] === this) {
            return;
        }
        if (table[databaseSymbol] !== undefined) {
            throw new Error(`Table ${table.name} belongs to another database`);
        }
        table[databaseSymbol] = this;
        this.tables.set(table.name, table);
    }

    deleteTable(table: Table) {
        if (table[databaseSymbol] === this) {
            delete table[databaseSymbol];
            this.tables.delete(table.name);
        }
    }
}

export class Table {

    [databaseSymbol]?: Database;
    private fields = new Index<string, AbstractField>();
    private records = new Index<number, Record>();
    private index = 0;
    private _name: string;

    constructor(name: string,
                ...fields: AbstractField[]) {
        this._name = name;
        for (const field of fields) {
            this.setField(field);
        }
    }

    get name() {
        return this._name;
    }

    set name(value) {
        if (this._name === value) {
            return;
        }
        const db = this[databaseSymbol];
        if (db) {
            for (const table of db.getTables()) {
                for (const field of table.getFields()) {
                    field.renameTable(this._name, value);
                }
            }
        }
        this._name = value;
    }

    getFields() {
        return this.fields.all();
    }

    getField(name: string | number) {
        if (typeof name === 'string') {
            return this.fields.get(name);
        }
        return this.fields.getAt(name);
    }

    setField(field: AbstractField) {
        if (field[tableSymbol] === this) {
            return;
        }
        if (field[tableSymbol] !== undefined) {
            throw new Error(`Field ${field.name} belongs to table ${field[tableSymbol]._name}`);
        }
        field[tableSymbol] = this;
        this.fields.set(field.name, field);
    }

    get(record: number) {
        return this.records.get(record);
    }

    add(record: Record) {
        if (record[tableSymbol] === this) {
            return;
        }
        if (record[tableSymbol] !== undefined) {
            throw new Error(`Record ${record[idSymbol]} belongs to table ${record[tableSymbol]._name}`);
        }
        record[tableSymbol] = this;
        if (record[idSymbol] !== undefined) {
            this.index = Math.max(this.index, record[idSymbol]);
        } else {
            record[idSymbol] = ++this.index;
        }
        this.records.set(record[idSymbol], record);
    }

    delete(record: Record | number) {
        if (typeof record === 'number') {
            const r = this.records.get(record);
            if (!r) {
                return;
            }
            record = r;
        } else if (record[tableSymbol] !== this) {
            return;
        }
        const i = record[idSymbol];
        if (i !== undefined) {
            this.records.deleteAt(i);
        }
        delete record[tableSymbol];
        delete record[idSymbol];
    }

    truncate() {
        for (const record of this.records.all()) {
            delete record[tableSymbol];
            delete record[idSymbol];
        }
        this.records.deleteAll();
    }
}

export abstract class AbstractField<TStored extends Value = Value, TCalculated = TStored> {

    [tableSymbol]?: Table;

    constructor(public name: string) {
    }

    renameTable(oldName: string, newName: string) {
        // override
    }

    calculate(value: TStored): TCalculated {
        return value as unknown as TCalculated;
    }

    abstract parse(value?: string): TStored;

    stringify(value?: TStored): string {
        return value === undefined || value === null ? '' : String(value);
    }
}

export class StringField extends AbstractField<string> {

    parse(value?: string): string {
        return value ? String(value) : '';
    }
}

export class NumberField extends AbstractField<number | undefined> {

    parse(value?: string): number | undefined {
        if (!value) {
            return undefined;
        }
        const n = parseFloat(value);
        return isNaN(n) ? undefined : n;
    }
}

export class BooleanField extends AbstractField<boolean> {

    parse(value?: string): boolean {
        if (value === '0') {
            return false;
        }
        return !!value;
    }

    stringify(value?: boolean): string {
        return value ? '1' : '0';
    }
}

export class DateField extends AbstractField<Date | undefined> {

    parse(value?: string): Date | undefined {
        if (!value) {
            return undefined;
        }
        const date = new Date(value);
        if (isNaN(date.valueOf())) {
            return undefined;
        }
        return date;
    }

    stringify(value?: Date): string {
        if (value) {
            return value.toISOString();
        }
        return '';
    }
}

export class ReferenceField extends AbstractField<number | undefined, Record | undefined> {

    renameTable(oldName: string, newName: string) {
        if (oldName === this.name) {
            this.name = newName;
        }
    }

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
}

export class Record {

    [idSymbol]?: number;
    [tableSymbol]?: Table;
    private values: { [name: string]: Value } = {};

    constructor(id?: number) {
        this[idSymbol] = id && isNaN(id) ? undefined : id;
    }

    get(name: string): Value {
        // todo
        // return this[tableSymbol]?.getField(name)?.cast(this.values[name]);
        return undefined;
    }

    set(name: string, value: Value) {
        // todo
        // this.values[name] = this[tableSymbol]?.getField(name)?.parse(value);
    }
}

export type Value = string | number | boolean | Date | null | undefined;

class Index<TKey extends string | number, TValue> {

    private hash: { [index in keyof any]: TValue } = {};
    private list: TKey[] = [];

    set(key: TKey, value: TValue) {
        if (!this.hash.hasOwnProperty(key)) {
            this.list.push(key);
        }
        this.hash[key] = value;
    }

    get(key: TKey): TValue | undefined {
        return this.hash[key];
    }

    getAt(index: number): TValue | undefined {
        return this.hash[this.list[index]];
    }

    all(): TValue[] {
        return this.list.map(key => this.hash[key]);
    }

    delete(key: TKey) {
        const index = this.list.indexOf(key);
        if (index >= 0) {
            this.list.splice(index, 1);
        }
        delete this.hash[key];
    }

    deleteAt(index: number) {
        const key = this.list[index];
        this.list.splice(index, 1);
        delete this.hash[key];
    }

    deleteAll() {
        this.hash = {};
        this.list = [];
    }
}