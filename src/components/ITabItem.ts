export interface ITabItem {
    name: string;
    icon: string;
    selected: boolean;
    readonly editable?: boolean;
    readonly removable?: boolean;
}