import React, { Component } from "react";
import CodeChain from "./contracts/CodeChain.json";
import getWeb3 from "./getWeb3";

import  {
  Router,
  Switch,
  Route
} from 'react-router-dom';
import "./App.css";

import HomePage from "./components/HomeView";
import BattleGrid from "./components/BattleShips";
import history from './components/history';

class App extends Component {
  state = { web3: null, accounts: null, contract: null };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = CodeChain.networks[networkId];
      const instance = new web3.eth.Contract(
        CodeChain.abi,
        deployedNetwork && deployedNetwork.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance });
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        {/* Router */}
        <Router history={history}>
          <Switch>

            {/* Landing Page */}
            <Route exact path="/">
              <HomePage/>
            </Route>

            {/* Battleships game Area */}
            <Route exact path="/battleships">
              <BattleGrid web3={this.state.web3} accounts={this.state.accounts} contract={this.state.contract} />
            </Route>

            <Route render={() => <h1>404: not found</h1>} />

          </Switch>
        </Router>
      </div>
    );
  }
}

export default App;
