import React from 'react';
// import logo from '../../../images/mstile-150x150.png';
import logo from '../../../images/mstile-150x150.png';

interface HeaderProps {
    loggedIn: boolean
}

const Header = ({ loggedIn }: HeaderProps) => {

    const handlerLogout = (): void => {
		localStorage.removeItem('refresh');
		localStorage.removeItem('access');
		window.location.href = "http://localhost:3000/login";
    }

    return (
        <header className="header">
            <img src={logo} className="logo" alt="logo">
            </img>
            <button onClick={() => handlerLogout()} className="auth">
                <div className="circle"></div>
                <div className="text">{ loggedIn ? 'log out' : 'log in' }</div>
			</button>
        </header>
    );
}

export default Header;