export interface ITabItem {
    name: string;
    icon: string;
    readonly selected: boolean;
    readonly editable?: boolean;
    readonly removable?: boolean;
}