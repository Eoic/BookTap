import * as React from 'react';
import Shelf from './Shelf';

export interface IShelvesProps {
}

export default class Shelves extends React.Component<IShelvesProps> {
  constructor(props: IShelvesProps) {
    super(props);
  }

  createMockList(itemCount: number) {
    let list = [];

    for (let i = 0; i < itemCount; i++) {
      list.push(<Shelf title="Shelf title" books={["A", "B", "C", "B", "C", "B", "C", "B", "C", "B", "C", "B", "C", "B", "C", "B", "C"]} />)
    }

    return list;
  }

  public render() {
    return (
      <section>
        <button className="btn btn-green font-medium">
          <i className="fas fa-plus icon-fixed-width" />
          CREATE NEW SHELF
        </button>
        <hr/>
        {this.createMockList(5).map((shelf) => shelf)}
      </section>
    );
  }
}
