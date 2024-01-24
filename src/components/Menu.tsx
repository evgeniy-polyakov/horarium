import {IMenuItem} from "@/components/IMenuItem";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useEffect, useRef} from "react";
import {classList} from "@/models/classList";

export interface IMenu {
    items: IMenuItem[],
    x: number,
    y: number,
    viewportWidth: number,
    viewportHeight: number,
    remove?: () => void
}

export function Menu({items, x, y, remove, viewportWidth, viewportHeight}: IMenu) {

    const nav = useRef<HTMLElement>(null);

    function onMouseDown(e: MouseEvent) {
        if (!nav.current?.contains(e.target as Node)) {
            remove?.();
        }
    }

    useEffect(() => {
        window.addEventListener("mousedown", onMouseDown, false);
        return () => {
            window.removeEventListener("mousedown", onMouseDown, false);
        }
    });

    useEffect(() => {
        if (nav.current) {
            nav.current.style.left = "0";
            nav.current.style.top = "0";
            const width = nav.current.offsetWidth;
            const height = nav.current.offsetHeight;
            nav.current.style.left = `${x < viewportWidth - width ? x : x - width}px`;
            nav.current.style.top = `${y < viewportHeight - height ? y : y - height}px`;
        }
    });

    return (
        <nav className="menu" ref={nav}
             style={{display: items.length > 0 ? "block" : "none"}}>
            <ul>
                {items.map((item, i) => (
                    <li key={i} onClick={() => {
                        remove?.();
                        item.select?.();
                    }} className={classList(item.className, {disabled: item.disabled})}>
                        <span className="icon">{item.icon && <FontAwesomeIcon icon={item.icon}/>}</span>
                        <span className="name">{item.name}</span>
                    </li>
                ))}
            </ul>
        </nav>
    );
}