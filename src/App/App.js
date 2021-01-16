// IMPORT LIBRARIES
import React from 'react';
import { connect } from 'react-redux';
import { Redirect, Route, Switch, withRouter } from 'react-router-dom';

// IMPORT ACTIONS
import { setUser } from '../Redux/User/User.actions'

// IMPORT CONTAINERS & COMPONENTS
import LandingPage from '../Containers/LandingPage/LandingPage.container';
import PlayerTable from '../Containers/PlayerTable/PlayerTable.component';
// import TestTable from '../Components/playerTable/testTable.component';

// IMPORT STYLES
import { library } from '@fortawesome/fontawesome-svg-core';
import { faSearch, faTools, faUserCircle } from '@fortawesome/free-solid-svg-icons';

import './App.scss';


library.add(faSearch, faUserCircle, faTools);


const mapState = (state) => {
  return {
    user: state.user.user
  }
}

const mapDispatch = (dispatch) => {
  return {
    setUser: (user) => dispatch(setUser(user))
  }
};

class App extends React.Component {
  componentDidMount() {
    console.log('APP MOUNTED...')
  }

  loadUser = (newUser) => {
    this.props.setUser(newUser);
  };

  refreshRoute = (route) => {
    const { history } = this.props;
    if (route === 'signout') {
      return history.push('signin')
    };
    return history.push(route);
  }

  render() {
    const { user } = this.props;
    const token = window.sessionStorage.getItem('token');
    return (
      <>
        <Switch>
          <Route exact path='/signin' render={() => <LandingPage route='signin' loadUser={this.loadUser} refreshRoute={this.refreshRoute}/>} />
          <Route exact path='/signup' render={() => <LandingPage route='signup' loadUser={this.loadUser} refreshRoute={this.refreshRoute} />} />
          <Route exact path='/draftboard' render={() => {
            if (user && user.userid) {
              return <PlayerTable />
            }
            // get profile is there is a sesssion
            if (token) {
              fetch('http://localhost:3000/signin', {
                method: 'POST',
                headers: {
                  'content-type': 'application/json',
                  'authorization': token
                }
              })
              .then(resp => resp.json())
              .then(user => {
                if (user && user.userid) {
                  fetch(`http://localhost:3000/profile/${parseInt(user.userid)}`, {
                    method: 'GET',
                    headers: {
                      'content-type': 'application/json',
                      'authorization': token
                    }
                  })
                  .then(resp => resp.json())
                  .then(user => {
                    if (user && user.username) {
                      this.loadUser(user);
                      return <PlayerTable />
                    }
                  })
                  .catch(err => console.log(err))
                }
              })
              .catch(err => console.log(err))
            }
          }} />
          <Route exact path='/' >
            <Redirect to='/signin' />
          </Route>
        </Switch>
      </>
    );
  }
}

export default connect(mapState, mapDispatch)(withRouter(App));