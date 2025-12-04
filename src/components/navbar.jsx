import React from 'react';
import logo from '../assets/logo.svg';
import '../styles/navbar.scss';

function Navbar() {
    return (
        <nav className="navbar">
            <img src={logo} alt="Logo" className="Navbar-logo" />
        </nav>
    );
}

export default Navbar;
