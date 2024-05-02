import React, { Component } from 'react';
import web3Connection from './web3Connection';
import Contract from './Contract';
import Voting from './Voting';
import Formate from './utils/Formate';
import 'semantic-ui-css/semantic.min.css';
import { Menu, Divider } from 'semantic-ui-react';
import { BrowserRouter, Switch, Route, Link, Redirect } from 'react-router-dom';
import Home from './components/Home';
import SignUp from './components/SignUp';
import SignIn from './components/SignIn';
import SignOut from './components/SignOut';
import './App.css';
import RegisterCandidate from './components/RegisterCandidate';
import RegisterVoter from './components/RegisterVoter';
import { VotingProvider } from './utils/Voter';
import UserList from './components/UserList';
import CandidateProfile from './components/CandidateProfile';
import VoteCandidate from './components/VoteCandidate';
import Events from './Events';
import OrganizeEvent from './components/OrganizeEvent';
import EventsList from './components/EventsList';

class App extends Component {
  state = {
    web3: null,
    account: null,
    contract: null,
    voting: null,
    balance: null,
    activeItem: 'Student Community Platform',
    signedUp: false,
    loggedIn: false,
    userType: '',
    color: '#C5E898',
    events: null,
  };

  handleItemClick = (e, { name }) =>
    this.setState({ activeItem: name, color: '#C5E898' });

  componentDidMount = async () => {
    const storedLoggedIn = localStorage.getItem('loggedIn') === 'true' || false;
    window.ethereum.on('accountsChanged', this.handleAccountsChanged);

    // Add an event listener for beforeunload
    const activeItem = localStorage.getItem('activeItem');
    const userType = localStorage.getItem('userType');

    try {
      const web3 = await web3Connection();
      const contract = await Contract(web3);
      const voting = await Voting(web3);
      const events = await Events(web3);
      const accounts = await web3.eth.getAccounts();

      this.setState(
        {
          web3,
          contract,
          voting,
          events,
          account: accounts[0],
          loggedIn: storedLoggedIn,
          activeItem,
          userType,
        },
        this.start
      );
    } catch (error) {
      alert(`Failed to load web3`);
      console.error(error);
    }

    await this.getAccount();
  };

  componentWillUnmount() {
    localStorage.setItem('loggedIn', this.state.loggedIn);
    localStorage.setItem('activeItem', this.state.activeItem);
    localStorage.setItem('userType', this.state.userType);
  }

  start = async () => {
    await this.getAccount();
    const { web3, contract, voting, account } = this.state;

    console.log('web3 =', web3);
    console.log('Contract =', contract);
    console.log('Voting =', voting);
    console.log('Acoount =', account);
  };

  handleAccountsChanged = (accounts) => {
    // Update the state with the new account
    this.setState({ account: accounts[0], loggedIn: false });
    // Perform any additional actions needed when the account changes
    // For example, you might want to reload data or trigger specific logic
    this.start();
  };

  getAccount = async () => {
    if (this.state.web3 !== null || this.state.web3 !== undefined) {
      await window.ethereum.on('accountsChanged', async (accounts) => {
        this.setState({
          account: accounts[0],
          loggedIn: false,
        });

        this.state.web3.eth.getBalance(accounts[0], (err, balance) => {
          if (!err) {
            this.setState({
              balance: Formate(this.state.web3.utils.fromWei(balance, 'ether')),
            });
          }
        });
      });
    }
  };

  accountCreated = async (signedUp) => {
    this.setState({ signedUp });
  };

  userSignedIn = async (loggedIn, userType) => {
    this.setState({ loggedIn, userType });
    localStorage.setItem('loggedIn', 'true');
    localStorage.setItem('userType', userType);
  };

  loggedOut = async (loggedIn) => {
    this.setState({ loggedIn, userType: '' });
    localStorage.removeItem('loggedIn');
    localStorage.removeItem('userType');
  };

  updateActiveItem = (name, color) => {
    this.setState({ activeItem: name, color });
  };

  render() {
    const { activeItem, color } = this.state;

    if (!this.state.web3) {
      return <div>Loading Web3...</div>;
    }

    return (
      <VotingProvider
        account={this.state.account}
        events={this.state.events}
        voting={this.state.voting}>
        <div className='App'>
          <div className='main-page'>
            <BrowserRouter>
              <div className='home-nav'>
                <Menu
                  stackable
                  secondary
                  size='large'>
                  <Menu.Item
                    name='Student Community Platform'
                    // color={color}
                    active={activeItem === 'Student Community Platform'}
                    onClick={this.handleItemClick}
                    as={Link}
                    to='/'
                    style={{
                      backgroundColor:
                        activeItem === 'Student Community Platform'
                          ? color
                          : '#0766AD',
                      color:
                        activeItem === 'Student Community Platform'
                          ? '#0766AD'
                          : '#F3F3F3',
                    }}
                  />
                  <Menu.Item
                    name='Events'
                    position='right'
                    active={activeItem === 'events list'}
                    onClick={this.handleItemClick}
                    as={Link}
                    to='/events-list'
                    style={{
                      backgroundColor:
                        activeItem === 'events list' ? color : '#0766AD',
                      color:
                        activeItem === 'events list' ? '#0766AD' : '#F3F3F3',
                    }}
                  />
                  {this.state.loggedIn && this.state.userType === 'admin' ? (
                    <Menu.Item
                      name='register candidate'
                      // color={color}
                      active={activeItem === 'register candidate'}
                      onClick={this.handleItemClick}
                      as={Link}
                      to='/register-candidate'
                      style={{
                        backgroundColor:
                          activeItem === 'register candidate'
                            ? color
                            : '#0766AD',
                        color:
                          activeItem === 'register candidate'
                            ? '#0766AD'
                            : '#F3F3F3',
                      }}
                    />
                  ) : (
                    <></>
                  )}
                  {this.state.loggedIn && this.state.userType === 'admin' ? (
                    <Menu.Item
                      name='register voter'
                      // color={color}
                      active={activeItem === 'register voter'}
                      onClick={this.handleItemClick}
                      as={Link}
                      to='/register-voter'
                      style={{
                        backgroundColor:
                          activeItem === 'register voter' ? color : '#0766AD',
                        color:
                          activeItem === 'register voter'
                            ? '#0766AD'
                            : '#F3F3F3',
                      }}
                    />
                  ) : (
                    <></>
                  )}
                  {this.state.loggedIn && this.state.userType === 'admin' ? (
                    <Menu.Item
                      name='user list'
                      // color={color}
                      active={activeItem === 'user list'}
                      onClick={this.handleItemClick}
                      as={Link}
                      to='/user-list'
                      style={{
                        backgroundColor:
                          activeItem === 'user list' ? color : '#0766AD',
                        color:
                          activeItem === 'user list' ? '#0766AD' : '#F3F3F3',
                      }}
                    />
                  ) : (
                    <></>
                  )}
                  {this.state.loggedIn &&
                  this.state.userType === 'candidate' ? (
                    <Menu.Item
                      // position='right'
                      name='candidate profile'
                      // color={color}
                      active={activeItem === 'candidate profile'}
                      onClick={this.handleItemClick}
                      as={Link}
                      to='/candidate-profile'
                      style={{
                        backgroundColor:
                          activeItem === 'candidate profile'
                            ? color
                            : '#0766AD',
                        color:
                          activeItem === 'candidate profile'
                            ? '#0766AD'
                            : '#F3F3F3',
                      }}
                    />
                  ) : (
                    <></>
                  )}
                  {this.state.loggedIn && this.state.userType === 'voter' ? (
                    <>
                      <Menu.Item
                        // position='right'
                        name='organize event'
                        active={activeItem === 'organize event'}
                        onClick={this.handleItemClick}
                        as={Link}
                        to='/organize-event'
                        style={{
                          backgroundColor:
                            activeItem === 'organize event' ? color : '#0766AD',
                          color:
                            activeItem === 'organize event'
                              ? '#0766AD'
                              : '#F3F3F3',
                        }}
                      />
                      <Menu.Item
                        // position='right'
                        name='vote candidate'
                        active={activeItem === 'vote candidate'}
                        onClick={this.handleItemClick}
                        as={Link}
                        to='/vote-candidate'
                        style={{
                          backgroundColor:
                            activeItem === 'vote candidate' ? color : '#0766AD',
                          color:
                            activeItem === 'vote candidate'
                              ? '#0766AD'
                              : '#F3F3F3',
                        }}
                      />
                    </>
                  ) : (
                    <></>
                  )}
                  {!this.state.loggedIn ? (
                    <Menu.Item
                      // position='right'
                      name='sign in'
                      // color={color}
                      active={activeItem === 'sign in'}
                      onClick={this.handleItemClick}
                      as={Link}
                      to='/sign-in'
                      style={{
                        backgroundColor:
                          activeItem === 'sign in' ? color : '#0766AD',
                        color: activeItem === 'sign in' ? '#0766AD' : '#F3F3F3',
                      }}
                    />
                  ) : (
                    <></>
                  )}

                  {this.state.loggedIn ? (
                    <Menu.Item
                      name='sign out'
                      // color='red'
                      position={
                        this.state.userType === 'admin' ? 'right' : null
                      }
                      active={activeItem === 'sign out'}
                      onClick={this.handleItemClick}
                      as={Link}
                      to='/sign-out'
                      style={{
                        backgroundColor:
                          activeItem === 'sign out' ? color : '#0766AD',
                        color:
                          activeItem === 'sign out' ? '#0766AD' : '#F3F3F3',
                      }}
                    />
                  ) : (
                    <Menu.Item
                      name='sign up'
                      // color={color}
                      active={activeItem === 'sign up'}
                      onClick={this.handleItemClick}
                      as={Link}
                      to='/sign-up'
                      style={{
                        backgroundColor:
                          activeItem === 'sign up' ? color : '#0766AD',
                        color: activeItem === 'sign up' ? '#0766AD' : '#F3F3F3',
                      }}
                    />
                  )}
                </Menu>
              </div>
              <Divider inverted />

              <Switch>
                <Route
                  exact
                  path='/'>
                  <Home updateActiveItem={this.updateActiveItem} />
                </Route>
                <Route path='/events-list'>
                  <EventsList updateActiveItem={this.updateActiveItem} />
                </Route>

                <Route path='/register-candidate'>
                  {this.state.loggedIn && this.state.userType === 'admin' ? (
                    <RegisterCandidate
                      updateActiveItem={this.updateActiveItem}
                    />
                  ) : (
                    'You Have Been Logged Out!'
                  )}
                </Route>

                <Route path='/register-voter'>
                  {this.state.loggedIn && this.state.userType === 'admin' ? (
                    <RegisterVoter updateActiveItem={this.updateActiveItem} />
                  ) : (
                    'You Have Been Logged Out!'
                  )}
                </Route>

                <Route path='/user-list'>
                  {this.state.loggedIn && this.state.userType === 'admin' ? (
                    <UserList updateActiveItem={this.updateActiveItem} />
                  ) : (
                    'You Have Been Logged Out!'
                  )}
                </Route>

                <Route path='/candidate-profile'>
                  {this.state.loggedIn &&
                  this.state.userType === 'candidate' ? (
                    <CandidateProfile
                      account={this.state.account}
                      updateActiveItem={this.updateActiveItem}
                    />
                  ) : (
                    'You Have Been Logged Out!'
                  )}
                </Route>

                <Route path='/vote-candidate'>
                  {this.state.loggedIn && this.state.userType === 'voter' ? (
                    <VoteCandidate
                      account={this.state.account}
                      updateActiveItem={this.updateActiveItem}
                    />
                  ) : (
                    'You Have Been Logged Out!'
                  )}
                </Route>

                <Route path='/organize-event'>
                  {this.state.loggedIn && this.state.userType === 'voter' ? (
                    <OrganizeEvent
                      account={this.state.account}
                      updateActiveItem={this.updateActiveItem}
                    />
                  ) : (
                    'You Have Been Logged Out!'
                  )}
                </Route>

                {
                  <Route path='/sign-in'>
                    {this.state.loggedIn ? (
                      this.state.userType === 'candidate' ? (
                        <Redirect to='/candidate-profile' />
                      ) : this.state.userType === 'voter' ? (
                        <Redirect to='/vote-candidate' />
                      ) : (
                        <Redirect to='/user-list' />
                      )
                    ) : (
                      <SignIn
                        web3={this.state.web3}
                        contract={this.state.contract}
                        account={this.state.account}
                        signedUp={this.state.signedUp}
                        userSignedIn={this.userSignedIn}
                        updateActiveItem={this.updateActiveItem}
                      />
                    )}
                  </Route>
                }

                {this.state.loggedIn ? (
                  <Route path='/sign-out'>
                    <SignOut loggedOut={this.loggedOut} />
                    You Have Been Logged Out!
                    <br></br>
                    Thank You For Using Our Platform!
                  </Route>
                ) : (
                  <Route path='/sign-up'>
                    <SignUp
                      web3={this.state.web3}
                      contract={this.state.contract}
                      account={this.state.account}
                      accountCreated={this.accountCreated}
                      updateActiveItem={this.updateActiveItem}
                    />
                  </Route>
                )}
              </Switch>
            </BrowserRouter>
          </div>
        </div>
      </VotingProvider>
    );
  }
}

export default App;
