import * as React from 'react';
import BookFilter from './BookFilter';
import UploadModal from './UploadModal';
import Stepper from './Stepper';
import Book from './Book';

export interface IBookListProps {
}

export default class BookList extends React.Component<IBookListProps> {

  createMockList(count: number) {
    let elements = [];

    for (let i = 0; i < count; i++) {
      elements.push(<Book key={i} author="Some very long  author" title="some title" />);
    }

    return elements;
  }

  public render() {
    return (
      <>
        <UploadModal />
        <hr />
        <BookFilter />
        <hr />
        <section className="grid-list">
          {this.createMockList(15).map((item) => item)}
        </section>
        <hr/>
        <Stepper size={50} />
      </>
    );
  }
}
