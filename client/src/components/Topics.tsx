import * as React from 'react';
import Topic from './Topic';

export interface ITopicsProps {
}

export default class Topics extends React.Component<ITopicsProps> {
  constructor(props: ITopicsProps) {
    super(props);
    this.createMockList = this.createMockList.bind(this);
  }

  createMockList(itemCount: number): any[] {
    let items = [];

    for (let i = 0; i < itemCount; i++) {
      items.push(<Topic itemCount={i} title={"Topic title"} description={"topic descriptiona"} />);
    }

    return items;
  }

  public render() {
    return (
      <>
        <button className="btn btn-green font-medium"> 
          <i className="fas fa-plus icon-fixed-width" />
          CREATE TOPIC 
        </button>
        <hr/>
        <section className="topic-list">
          {this.createMockList(10).map((topic) => topic)}
        </section>
      </>
    );
  }
}
