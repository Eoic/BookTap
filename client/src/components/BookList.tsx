import * as React from 'react';
import BookFilter from './BookFilter';
import UploadModal from './UploadModal';

export interface IBookListProps {
}

export default class BookList extends React.Component<IBookListProps> {

  createMockList(count: number) {
    let elements = [];

    for (let i = 0; i < count; i++) {
      elements.push(<div key={i} className="grid-item"></div>);
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
      </>
    );
  }
}
