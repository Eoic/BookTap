import * as React from 'react';

export interface IHeaderProps {
}

export function Header(props: IHeaderProps) {
    return (
        <header className="hero">
            <div className="hero-content">
                <h1> Your online e-book library </h1>
                <div className="hero-header-divider">&nbsp;</div>
                <p> Easy to use e-book management system to organize your books into digital bookshelves, grouping 
                    and sorting by custom topics and metadata. </p>
            </div>
            <img alt="Pile of books." style={{ maxWidth: "37%" }} src="img/book-pile.png"></img>
        </header>
    );
}