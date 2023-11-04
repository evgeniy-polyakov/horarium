const databaseSymbol = Symbol('database');
const tableSymbol = Symbol('table');
const idSymbol = Symbol('id');

export class Database {

    private tables = new Map<string, Table>();

    constructor(...tables: Table[]) {
        for (const table of tables) {
            this.setTable(table);
        }
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

    parse(csv: string) {
        // todo
    }

    stringify(): string {
        // todo
        return '';
    }
}

export class Table {

    [databaseSymbol]?: Database;
    private fields = new Map<string, AbstractField>();
    private records = new Map<number, Record>();
    private index = 0;

    constructor(readonly name: string,
                ...fields: AbstractField[]) {
        for (const field of fields) {
            this.setField(field);
        }
    }

    getField(name: string) {
        return this.fields.get(name);
    }

    setField(field: AbstractField) {
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
            throw new Error(`Record ${record[idSymbol]} belongs to table ${record[tableSymbol].name}`);
        }
        record[tableSymbol] = this;
        if (record[idSymbol] !== undefined) {
            this.index = Math.max(this.index, record[idSymbol]);
        } else {
            record[idSymbol] = ++this.index;
        }
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
            this.records.delete(i);
        }
        record[tableSymbol] = undefined;
        record[idSymbol] = undefined;
    }

    truncate() {
        for (const record of this.records.values()) {
            record[tableSymbol] = undefined;
            record[idSymbol] = undefined;
        }
        this.records.clear();
    }
}

export abstract class AbstractField<P extends Value = Value, U extends Value = P> {

    [tableSymbol]?: Table;

    constructor(readonly name: string) {
    }

    abstract unpack(value: Value): U;

    pack(value: Value): P {
        return this.unpack(value) as unknown as P;
    }

    stringify(value: Value): string {
        value = this.pack(value);
        return value === undefined || value === null ? '' : String(value);
    }
}

export class StringField extends AbstractField<string> {

    unpack(value: Value): string {
        return value ? String(value) : '';
    }
}

export class NumberField extends AbstractField<number | undefined> {

    unpack(value: Value): number | undefined {
        if (typeof value === 'number') {
            return value;
        }
        const n = parseFloat(String(value));
        return isNaN(n) ? undefined : n;
    }
}

export class BooleanField extends AbstractField<boolean> {

    unpack(value: Value): boolean {
        return !!value;
    }

    stringify(value: Value): string {
        return value ? '1' : '0';
    }
}

export class DateField extends AbstractField<Date | undefined> {

    unpack(value: Value): Date | undefined {
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
        const date = this.pack(value);
        if (date) {
            return date.toISOString();
        }
        return '';
    }
}

export class ReferenceField extends AbstractField<number | undefined, Record | undefined> {

    unpack(value: Value): Record | undefined {
        const id = typeof value === 'number' ? value : parseInt(String(value));
        if (isNaN(id)) {
            return undefined;
        }
        return this[tableSymbol]?.[databaseSymbol]?.getTable(this.name)?.get(id);
    }

    pack(value: Value): number | undefined {
        if (value instanceof Record) {
            return value[idSymbol];
        }
        if (typeof value === 'number') {
            return value;
        }
        const id = parseInt(String(value));
        if (!isNaN(id)) {
            return id;
        }
        return undefined;
    }
}

export class Record {

    [idSymbol]?: number;
    [tableSymbol]?: Table;
    private values = new Map<string, Value>();

    getValue(name: string): Value {
        return this[tableSymbol]?.getField(name)?.unpack(this.values.get(name));
    }

    setValue(name: string, value: Value) {
        this.values.set(name, this[tableSymbol]?.getField(name)?.pack(value));
    }
}

export type Value = string | number | boolean | Date | Record | null | undefined;