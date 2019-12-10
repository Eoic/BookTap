import * as React from 'react';

export interface ISummaryCardProps {
  title: string,
  value: string,
}

export default class SummaryCard extends React.Component<ISummaryCardProps> {
  public render() {
    return (
      <div className="summary">
        <h3 className="summary-header">{this.props.title}</h3>
        {this.props.children}
      </div>
    );
  }
}
