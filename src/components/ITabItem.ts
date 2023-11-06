export interface ITabItem {
    label: string,
    readonly link: string,
    readonly editable?: boolean,
    readonly removable?: boolean,
    readonly selected: boolean,
}