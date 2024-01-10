'use client';

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {IconProp} from "@fortawesome/fontawesome-svg-core";

export function IconButton({icon, onClick}: {
    icon: IconProp,
    onClick?: () => void,
}) {
    return (
        <button className="icon" onClick={onClick}>
            <FontAwesomeIcon icon={icon}/>
        </button>
    );
}
