export interface ITabItem {
    selected: boolean;
    name: string;
    readonly link?: string;
    readonly editable?: boolean;
    readonly removable?: boolean;
}