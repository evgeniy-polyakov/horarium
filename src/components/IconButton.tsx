'use client';

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {IconProp} from "@fortawesome/fontawesome-svg-core";

export function IconButton(_: {
    icon: IconProp,
    onClick?: () => void,
}) {
    return (
        <button className="icon" onClick={_.onClick}>
            <FontAwesomeIcon icon={_.icon}/>
        </button>
    );
}
