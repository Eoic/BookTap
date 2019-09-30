import * as React from 'react';

export interface IMainSectionProps {
}

export function MainSection(props: IMainSectionProps) {
    return (
        <header className="hero">
            <h1> Title </h1>
            <p> Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                    eiusmod tempor incididunt ut labore et dolore magna aliqua.
                    Ut enim ad minim veniam, quis nostrud exercitation ullamco
                    laboris nisi ut aliquip ex ea commodo consequat.</p>
        </header>
    );
}