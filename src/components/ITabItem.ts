export interface ITabItem {
    readonly key: string;
    name: string;
    icon: string;
    readonly selected: boolean;
    readonly editable?: boolean;
    readonly removable?: boolean;
}