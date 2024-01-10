import {IconProp} from "@fortawesome/fontawesome-svg-core";

export interface ITabItem {
    readonly key: string;
    name?: string;
    icon?: IconProp;
    readonly selected: boolean;
    readonly editable?: boolean;
    readonly removable?: boolean;
}