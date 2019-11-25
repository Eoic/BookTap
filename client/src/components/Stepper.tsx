import * as React from 'react';

export interface IStepperProps {
    size: number,
}

export default class Stepper extends React.Component<IStepperProps> {
  public render() {
    return (
      <>
        <button className="btn btn-blue font-medium mr-10">
            <i className="fas fa-arrow-left icon-fixed-width"/>
            Previous {this.props.size} 
        </button>
        <button className="btn btn-blue font-medium mr-20"> 
            Next {this.props.size}
            <i className="fas fa-arrow-right icon-fixed-width" /> 
        </button>
        <button className="btn btn-blue font-medium">
            <i className="fas fa-folder-open icon-fixed-width" />
            Show all
        </button>
      </>
    );
  }
}
