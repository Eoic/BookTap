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
                            <i className="fas fa-book"> Title </i>
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
                </ul>
                <div className="clearfix"> </div>
            </nav>
        );
    }
}

{/*
            <nav>
                <ul>
                    <li>
                        <Link to='/'>
                            <i className='fas fa-book fa-2x nav-brand'>
                                <p style={{ display: "inline", margin: 0 }}> Title </p>
                            </i>
                        </Link>
                    </li>
                    <li>
                        <Link to="/"> About </Link>
                    </li>
                    <li>
                        <Link to="/login" className="btn btn-green"> Login </Link>
                    </li>
                    <li>
                        <Link to="/register" className="btn btn-blue"> Sign Up </Link>
                    </li>
                    <li>
                        <Link to="/library" className="btn btn-purple"> Library </Link>
                    </li>
                </ul>
            </nav>
            */}