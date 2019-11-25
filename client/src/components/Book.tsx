import * as React from 'react';
import SubMenu from './SubMenu';

export interface IBookProps {
  title: string,
  author: string,
}

export interface IBookState {
  isMenuOpen: boolean,
}

export default class Book extends React.Component<IBookProps, IBookState> {
  constructor(props: IBookProps) {
    super(props);
    this.state = {
      isMenuOpen: false
    }

    this.toggleMenu = this.toggleMenu.bind(this);
    this.hideMenu = this.hideMenu.bind(this);
  }

  toggleMenu() {
    this.setState({ isMenuOpen: !this.state.isMenuOpen });
  }

  hideMenu() {
    this.setState({ isMenuOpen: false })
  }

  public render() {
    return (
      <div className="book-grid-item">
        <img className="book-cover" src=""/>
        <div className="book-info">
          <div>
            <p title={this.props.title}>{this.props.title}</p>
            <p title={this.props.author} className="font-small">{this.props.author}</p>
          </div>
          <button className="btn" onClick={this.toggleMenu} onBlur={this.hideMenu}>
            <i className="fas fa-ellipsis-v" />
          </button>
          <div className="clearfix"/>
          <SubMenu isOpen={this.state.isMenuOpen} />
        </div>
      </div>
    );
  }
}
