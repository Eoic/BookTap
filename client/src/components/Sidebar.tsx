import * as React from 'react';

export interface ISidebarProps {
}

export default class Sidebar extends React.Component<ISidebarProps> {
  public render() {
    return (
      <aside className='sidebar'>
        {this.props.children}
      </aside>
    );
  }
}
