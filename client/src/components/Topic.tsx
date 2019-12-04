import * as React from 'react';

export interface ITopicProps {
  title: string,
  description: string,
  itemCount: number
}

export default class Topic extends React.Component<ITopicProps> {
  public render() {
    return (
      <div className="topic">
        <a href="/"> {this.props.title} </a>
        <button className="topic-btn topic-btn-delete">
          <i className="fas fa-trash" />
        </button>
        <p className="topic-description"> {this.props.description} </p>
        <hr />
        <p className="topic-subtitle"> {this.props.itemCount} books </p>
      </div>
    );
  }
}
