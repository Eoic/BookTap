import * as React from 'react';
import { Link } from "react-router-dom";
import MenuBurger from './MenuBurger';

export interface INavigationProps {
    isAuthenticated: boolean
}

export interface INavigationState {
    isMenuOpen: boolean
}

enum LinkType {
    PrivateOnly,
    PublicOnly,
    Unprotected,
}

const links = [
    {
        path: "register",
        text: "Sign Up",
        position: "fl-right",
        linkType: LinkType.PublicOnly,
        linkStyle: {
            desktop: "btn btn-blue-outline",
        },
    },
    {
        path: "login",
        text: "Login",
        position: "fl-right",
        linkType: LinkType.PublicOnly,
        linkStyle: {
            desktop: "btn btn-green-outline",
        }
    },
    {
        path: "logout",
        text: "Logout",
        position: "fl-right",
        linkType: LinkType.PrivateOnly,
        linkStyle: {
            desktop: "btn btn-red-outline",
        }
    },
    {
        path: "library",
        text: "Library",
        position: "fl-right",
        linkType: LinkType.PrivateOnly,
        linkStyle: {
            desktop: "nav-link"
        }
    },
    {
        path: "users",
        text: "Users",
        position: "fl-right",
        linkType: LinkType.PrivateOnly,
        linkStyle: {
            desktop: "nav-link",
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

    isLinkVisible(linkType: LinkType) {
        return (linkType === LinkType.PrivateOnly && this.props.isAuthenticated) ||
               (linkType ===  LinkType.PublicOnly && !this.props.isAuthenticated) ||
               (linkType === LinkType.Unprotected);
    }

    public render() {
        return (
            <nav className={`navbar ${this.state.isMenuOpen ? "navbar-mobile" : ""}`}>
                <ul>
                    <li>
                        <Link to='/' className="navbar-brand">
                            <i className="fas fa-book"> BookTap </i>
                        </Link>
                    </li>

                    {/* Desktop links */}
                    {links.map((link: any, index) => (
                        <li className={link.position} key={index}>
                            {
                                this.isLinkVisible(link.linkType) && 
                                <Link to={`/${link.path}`} className={link.linkStyle.desktop}>
                                    {link.text}
                                </Link>
                            }
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
                            <Link to={link.path} className={"nav-mobile-link"}>
                                {link.text}
                            </Link>
                        </li>
                    ))}
                </ul>}
                <div className="clearfix"> </div>
            </nav>
        );
    }
}