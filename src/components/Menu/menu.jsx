import React from "react";
import { TbMenu } from "react-icons/tb";
import './styles.css';

function Menu({isActive, toggleMenu}) {
    return (
        <>
            <div className="menu-btn" onClick={() => toggleMenu()}>
                <p>Menu</p>
                <TbMenu/>
            </div>
        </>
    );
}

export default Menu;