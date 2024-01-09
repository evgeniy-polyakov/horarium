'use client';

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {IconProp} from "@fortawesome/fontawesome-svg-core";

export default function IconButton(_: {
    icon: IconProp,
    onClick?: () => void,
}) {
    return (
        <button onClick={_.onClick}>
            <FontAwesomeIcon icon={_.icon}/>
        </button>
    );
}
