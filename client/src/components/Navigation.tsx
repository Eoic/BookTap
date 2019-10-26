import * as React from 'react';
import { Link } from "react-router-dom";
import MenuBurger from './MenuBurger';
import { ILink } from '../interfaces/ILink';
import UserContext from '../context/UserContext';

export interface INavigationProps {
}

export interface INavigationState {
    isMenuOpen: boolean
}

const links = [
    {
        path: "register",
        text: "Sign Up",
        linkStyle: {
            desktop: "btn btn-blue-outline",
            mobile: "nav-mobile-link"
        }
    },
    {
        path: "login",
        text: "Login",
        linkStyle: {
            desktop: "btn btn-green-outline",
            mobile: "nav-mobile-link"
        }
    },
    {
        path: "logout",
        text: "Logout",
        linkStyle: {
            desktop: "btn btn-red-outline",
            mobile: "nav-mobile-link"
        }
    }
];

export default class Navigation extends React.Component<INavigationProps, INavigationState> {
    constructor(props: INavigationProps) {
        super(props);
        this.state = { isMenuOpen: false }
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        this.setState({ isMenuOpen: !this.state.isMenuOpen });
    }

    createLink(link: ILink) {
        return (
            <li className={link.listStyle}>
                <Link to={link.path} className={link.linkStyle}>
                    {link.text}
                </Link>
            </li>
        );
    }

    public render() {
        return (
            <UserContext.Consumer>
                {({ username, type, updateUser }) => (
                    <nav className={`navbar ${this.state.isMenuOpen ? "navbar-mobile" : ""}`}>
                        <ul>
                            <li>
                                <Link to='/' className="navbar-brand">
                                    <i className="fas fa-book"> BookTap: {username} </i>
                                </Link>
                            </li>

                            {/* Desktop links */}
                            {links.map((link: any, index) => (
                                <li className="fl-right" key={index}>
                                    <Link to={link.path} className={link.linkStyle.desktop}>
                                        {link.text}
                                    </Link>
                                </li>
                            ))}

                            <li className="fl-right">
                                <MenuBurger handleClick={this.handleClick} isMenuOpen={this.state.isMenuOpen} />
                            </li>
                        </ul>

                        {this.state.isMenuOpen && <ul>
                            <hr className="divider"></hr>
                            {/* Mobile links */}
                            {links.map((link: any, index) => (
                                <li style={{ display: "block", margin: 0, marginBottom: 5 }} onClick={this.handleClick} key={index}>
                                    <Link to={link.path} className={link.linkStyle.mobile}>
                                        {link.text}
                                    </Link>
                                </li>
                            ))}
                        </ul>}
                        <div className="clearfix"> </div>
                    </nav>
                )}
            </UserContext.Consumer>
        );
    }
}