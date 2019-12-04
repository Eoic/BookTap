import * as React from 'react';
import { Header } from './Header';
import Main from './Main';
import { Footer } from './Footer';

export interface ILandingPageProps {
}

export default class LandingPage extends React.Component<ILandingPageProps> {
  public render() {
    return (
      <>
        <Header />
        <Main />
        <Footer />
      </>
    );
  }
}
