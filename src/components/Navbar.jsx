import React from 'react';
import {Link} from "react-router-dom";
import logo from '../assets/logo.svg';
import '../styles/navbar.scss';

function Navbar() {
    return (
        <nav className="navbar">
            <Link to="/">
                <img src={logo} alt="Logo" className="Navbar-logo"/>
            </Link>
        </nav>
    );
}

export default Navbar;
