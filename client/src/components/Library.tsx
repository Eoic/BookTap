import * as React from 'react';
import Sidebar from './Sidebar';

export interface ILibraryProps {
}

export default class Library extends React.Component<ILibraryProps> {
  public render() {
    return (
      <>
        <Sidebar>
          <h4 className="sidebar-header">
            Library
          </h4>
          <button className="btn fl-right">
            <i className="fas fa-stream"></i>
          </button>
          <div className="clearfix" />
          <p className="subtitle"> Browse </p>
          <ul className="menu-list pl-0">
            <li>
              <button className="btn btn-grey btn-fluid text-left">
                <i className="fas fa-clipboard-list icon-fixed-width"></i>
                All books
              </button>
            </li>
            <li>
              <button className="btn btn-grey btn-fluid text-left">
                <i className="fas fa-clipboard-list icon-fixed-width"></i>
                Topics
              </button>
            </li>
            <li>
              <button className="btn btn-grey btn-fluid text-left">
                <i className="fas fa-clipboard-list icon-fixed-width"></i>
                Shelves
              </button>
            </li>
          </ul>
          <hr className="divider" />
          <p className="subtitle"> Your books </p>
          <ul className="menu-list pl-0">
            <li>
              <button className="btn btn-grey btn-fluid text-left">
                <i className="fas fa-star icon-fixed-width"></i>
                Favourite
              </button>
            </li>
            <li>
              <button className="btn btn-grey btn-fluid text-left">
                <i className="fas fa-clipboard-list icon-fixed-width"></i>
                Reading log
                <i className="fas fa-chevron-right fl-right"></i>
              </button>
              <ul className="menu-list pl-20">
                <li>
                  <button className="btn btn-grey btn-fluid text-left">
                    <i className="fas fa-book-reader icon-fixed-width"></i>
                    Reading
                  </button>
                  <button className="btn btn-grey btn-fluid text-left">
                    <i className="fas fa-check-square icon-fixed-width"></i>
                    Finished
                  </button>
                </li>
              </ul>
            </li>
          </ul>
          <hr className="divider" />
        </Sidebar>
        <section className="lib-content">
          Hello
        </section>
      </>
    );
  }
}
