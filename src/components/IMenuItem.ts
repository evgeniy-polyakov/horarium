import {IconProp} from "@fortawesome/fontawesome-svg-core";

export interface IMenuItem {
    readonly name?: string;
    readonly icon?: IconProp;
    readonly className?: string;
    readonly disabled?: boolean;
    readonly separator?: boolean;
    select?(): void;
}