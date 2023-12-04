export interface ITabItem {
    name: string;
    selected: boolean;
    readonly editable?: boolean;
    readonly removable?: boolean;
}