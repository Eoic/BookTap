import * as React from 'react';
import BookFilter from './BookFilter';

export interface IBookListProps {
}

export default class BookList extends React.Component<IBookListProps> {
  public render() {
    return (
      <div>
        <BookFilter/>
        <div>
            
        </div>
      </div>
    );
  }
}
