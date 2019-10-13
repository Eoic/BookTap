import * as React from 'react';
import { Link } from "react-router-dom";

export interface INavigationProps {
}

export default class Navigation extends React.Component<INavigationProps> {
    public render() {
        return (
            <nav className="navbar">
                <ul>
                    <li>
                        <Link to='/' className="navbar-brand">
                            <i className="fas fa-book"> BookTap </i>
                        </Link>
                    </li>

                    <li className="fl-right">
                        <Link to='/login' className='btn btn-red'>
                            Logout
                        </Link>
                    </li>

                    <li className="fl-right">
                        <Link to='/login' className='btn btn-green'>
                            Login
                        </Link>
                    </li>

                    <li className="fl-right">
                        <Link to='/register' className='btn btn-blue'>
                            Sign Up
                        </Link>
                    </li>

                    <li className="fl-right">
                        <Link to='/#' className="nav-link">
                            Link 3
                        </Link>
                    </li>

                    <li className="fl-right">
                        <Link to='/library' className="nav-link">
                            Library
                        </Link>
                    </li>

                    <li className="fl-right">
                        <Link to='/#' className="nav-link">
                            About
                        </Link>
                    </li>
                    <li className="fl-right">
                        <button className="menu-burger">
                            <i className="fas fa-bars"></i>
                        </button>
                    </li>
                </ul>
                <div className="clearfix"> </div>
            </nav>
        );
    }
}