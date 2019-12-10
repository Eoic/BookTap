import * as React from 'react';

export interface IFooterProps {
}

export function Footer(props: IFooterProps) {
	return (
		<footer className="footer">
			&copy; {new Date().getFullYear()}
		</footer>
	);
}
