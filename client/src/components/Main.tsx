import * as React from 'react';

export interface IMainProps {
}

export default class Main extends React.Component<IMainProps> {
  public render() {
    return (
      <main className="features-list">
        <div className="card">
            <h4>
            <i className="fas fa-globe"></i> Access from any device </h4>
            <p> It does not matter wheter you are using PC, mobile device or a tablet </p>
        </div>
        <div className="card">
            <h4> 
            <i className="fas fa-file-alt"></i> Different e-book formats supported </h4>
            <p> Upload books in .pdf, .epub, .mobi, .djvu formats </p>
        </div>        
        <div className="card">
            <h4>
            <i className="fas fa-tasks"></i> Track your progress </h4>
            <p> Mark which books you read, currently reading or already finished </p>
        </div>
        <div className="card">
            <h4> 
            <i className="fas fa-random"></i> Organize into categories </h4>
            <p> Separate yout books into bookshelves, assign topics, descriptions or sort by metadata </p>
        </div>
        <div className="card">
            <h4> 
            <i className="fas fa-database"></i> Convenient file transfer </h4>
            <p> Download your books easily to any device in bulk as an archive or separately one file at a time </p>
        </div>
        <div className="card">
            <h4> 
            <i className="fas fa-tablet-alt"></i> Built-in reader </h4>
            <p> Open and read books in the browser without installing additional software </p>
        </div>
      </main>
    );
  }
}
