import {IMenuItem} from "@/components/IMenuItem";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCaretRight} from '@fortawesome/free-solid-svg-icons'
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
        const menu = nav.current;
        if (menu) {
            menu.style.left = "0";
            menu.style.top = "0";
            menu.querySelectorAll("ul").forEach(it => {
                it.style.display = "block";
                it.style.left = "100%";
                it.style.right = "auto";
                it.style.top = "0";
                it.style.bottom = "auto";
            });
            const widthWithSubmenu = menu.scrollWidth;
            const heightWithSubmenu = menu.scrollHeight;
            const width = menu.offsetWidth;
            const height = menu.offsetHeight;
            const isRight = x > viewportWidth - width;
            const isBottom = y > viewportHeight - height;
            const isRightSubmenu = x > viewportWidth - widthWithSubmenu;
            const isBottomSubmenu = y > viewportHeight - heightWithSubmenu;
            menu.querySelectorAll("ul").forEach(it => {
                it.style.display = "";
                it.style.left = "";
                it.style.right = "";
                it.style.top = "";
                it.style.bottom = "";
            });
            menu.style.left = `${isRight ? x - width : x}px`;
            menu.style.top = `${isBottom ? y - height : y}px`;
            menu.classList.toggle('menu-right', isRightSubmenu);
            menu.classList.toggle('menu-bottom', isBottomSubmenu);
        }
    });

    function renderItems(items: IMenuItem[]) {
        return (<ul>
            {items.map((item, i) => item.separator ? (
                <li key={i} className="separator"></li>
            ) : (
                <li key={i} onClick={() => {
                    remove?.();
                    item.select?.();
                }} className={classList(item.className, {disabled: item.disabled})}>
                    <span className="icon">{item.icon && <FontAwesomeIcon icon={item.icon}/>}</span>
                    <span className="name">{item.name}</span>
                    {item.items && <span className="expand"><FontAwesomeIcon icon={faCaretRight}/></span>}
                    {item.items && renderItems(item.items)}
                </li>
            ))}
        </ul>);
    }

    return (
        <nav className="menu" ref={nav}
             style={{display: items.length > 0 ? "block" : "none"}}
             onContextMenu={e => e.preventDefault()}>
            {renderItems(items)}
        </nav>
    );
}