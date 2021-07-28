import React from 'react';
import { BrowserRouter, Link, Route, Switch } from 'react-router-dom';
import './App.css';
import { ConnectButton } from './components/ConnectButton';
import { ConnectionConsumer, ConnectionProvider } from './providers/Connection';
import { Claim } from './views/Claim';
import { Sign } from './views/Sign';
import { View } from './views/View';

export default function App() {
  return (
    <BrowserRouter>
      <header>
        <h1>Web3T3 Certificates</h1>
        <nav>
          <Link to="/">Home</Link> / <Link to="/sign">Sign</Link> /{' '}
          <Link to="/claim">Claim</Link> / <Link to="/certificate">View</Link>
        </nav>
      </header>

      <ConnectionProvider>
        <ConnectionConsumer>
          {(connection) => (
            <>
              {!connection.isConnected && <ConnectButton />}
              <Switch>
                <Route exact path="/">
                  <p>
                    Web3 Teacher Training Track (Web3T3) Certificates are issued
                    to all participants by the <a href="https://blockchainacceleration.org/">Blockchain Acceleration
                    Foundation</a>.
                  </p>
                  <p>
                    <a href="https://web3.courses/">Learn more</a> about the Web3 Teacher Training Track.
                  </p>
                </Route>
                <Route path="/sign">
                  {!connection.isConnected && (
                    <p>
                      You must be connected to a Web3 provider to use this page.
                    </p>
                  )}
                  {connection.isConnected && <Sign />}
                </Route>
                <Route path="/claim">
                  {!connection.isConnected && (
                    <p>
                      You must be connected to a Web3 provider to use this page.
                    </p>
                  )}
                  {connection.isConnected && <Claim />}
                </Route>
                <Route path="/certificate/:tokenId(\d+)?">
                  {!connection.isConnected && (
                    <p>
                      You must be connected to a Web3 provider to use this page.
                    </p>
                  )}
                  {connection.isConnected && <View />}
                </Route>
              </Switch>
            </>
          )}
        </ConnectionConsumer>
      </ConnectionProvider>
    </BrowserRouter>
  );
}
