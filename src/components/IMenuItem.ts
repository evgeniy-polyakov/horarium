import {IconProp} from "@fortawesome/fontawesome-svg-core";

export interface IMenuItem {
    readonly name: string;
    readonly icon?: IconProp;
    readonly className?: string;
    readonly disabled?: boolean;
    select?(): void;
}