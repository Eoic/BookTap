import * as React from 'react';

export interface IMainProps {
}

export default class Main extends React.Component<IMainProps> {
  public render() {
    return (
      <main className="features-list">
        <div className="card">
            <h4>
            <i className="fas fa-book-open"></i> Feature title </h4>
            <p> lorem ipusm lorem ipusm lorem ipusm lorem ipusm lorem ipusm lorem ipusm lorem ipusm lorem ipusm </p>
        </div>
        <div className="card">
            <h4> Feature title </h4>
            <p> lorem ipusm lorem ipusm lorem ipusm lorem ipusm lorem ipusm lorem ipusm lorem ipusm lorem ipusm </p>
        </div>        <div className="card">
            <h4> Feature title </h4>
            <p> lorem ipusm lorem ipusm lorem ipusm lorem ipusm lorem ipusm lorem ipusm lorem ipusm lorem ipusm </p>
        </div>
        <div className="card">
            <h4> Feature title </h4>
            <p> lorem ipusm lorem ipusm lorem ipusm lorem ipusm lorem ipusm lorem ipusm lorem ipusm lorem ipusm </p>
        </div>
        <div className="card">
            <h4> Feature title </h4>
            <p> lorem ipusm lorem ipusm lorem ipusm lorem ipusm lorem ipusm lorem ipusm lorem ipusm lorem ipusm </p>
        </div>
        <div className="card">
            <h4> Feature title </h4>
            <p> lorem ipusm lorem ipusm lorem ipusm lorem ipusm lorem ipusm lorem ipusm lorem ipusm lorem ipusm </p>
        </div>
      </main>
    );
  }
}
