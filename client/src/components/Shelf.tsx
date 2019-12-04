import * as React from 'react';
// import Book from './Book';

export interface IShelfProps {
  title: string,
  books: string[]
}

export default class Shelf extends React.Component<IShelfProps> {
  public render() {
    return (
      <div className="shelf">
        <a href="/"> {this.props.title} </a>
        <p style={{ display: "inline", color: "grey"}}> {this.props.books.length} books </p>
        <div>
          {this.props.books.map((book, index) => (
            <div key={index} className="book-grid-item">
              {book}
            </div>
          ))}
        </div>
      </div>
    );
  }
}
