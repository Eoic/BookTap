import * as React from 'react';

export interface IHeaderProps {
}

export function Header(props: IHeaderProps) {
    return (
        <header className="hero">
            <div className="hero-content">
                <h1> Your online book library </h1>
                <div className="hero-header-divider">&nbsp;</div>
                <p> Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                        eiusmod tempor incididunt ut labore et dolore magna aliqua.
                        Ut enim ad minim veniam, quis nostrud exercitation ullamco
                        laboris nisi ut aliquip ex ea commodo consequat.</p>
            </div>
            <img alt="Pile of books." style={{ maxWidth: "37%" }} src="img/book-pile.png"></img>
        </header>
    );
}