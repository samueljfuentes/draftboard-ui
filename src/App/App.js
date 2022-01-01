// IMPORT LIBRARIES
import React from 'react';
import { connect } from 'react-redux';
import { Redirect, Route, Switch, withRouter } from 'react-router-dom';

// IMPORT ACTIONS
import { setUser } from '../Redux/User/User.actions'

// IMPORT CONTAINERS & COMPONENTS
import LandingPage from '../Containers/LandingPage/LandingPage.container';
import Draftboard from '../Containers/Draftboard/Draftboard.component';

// IMPORT STYLES
import { library } from '@fortawesome/fontawesome-svg-core';
import { faSearch, faTools, faUserCircle } from '@fortawesome/free-solid-svg-icons';

import './App.scss';
import '../Other/Styles/svg-icons.scss'


library.add(faSearch, faUserCircle, faTools);


const mapState = (state) => {
  return {
    user: state.user.user,
    routes: state.user.routes
  }
}

const mapDispatch = (dispatch) => {
  return {
    setUser: (user) => dispatch(setUser(user)),
    // setRoutes: (routes) => dispatch(setRoutes(routes))
  }
};

class App extends React.Component {
  componentDidMount() {
    console.log('APP MOUNTED...');
    console.log(this.props.routes)
    
  }

  loadUser = (newUser) => {
    if (newUser === 'guest') {
      window.sessionStorage.setItem('token', newUser);
    }
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
    const { user, routes } = this.props;
    const token = window.sessionStorage.getItem('token');
    console.log(token);
    // VERIFY IF NECESSARY IN PRODUCTION... --------------------
    console.log(process.env.NODE_ENV);
    const homeRoute = !process.env.NODE_ENV || process.env.NODE_ENV === 'development' ?
    '/draftboard-ui' :
    '/draftboard';
    console.log(homeRoute);
    // ---------------------------------------------------------
    return (
      <>
        <Switch>
          <Route exact path='/signin' render={() => <LandingPage route='signin' loadUser={this.loadUser} refreshRoute={this.refreshRoute} apiRoutes={routes} />} />
          <Route exact path='/signup' render={() => <LandingPage route='signup' loadUser={this.loadUser} refreshRoute={this.refreshRoute} apiRoutes={routes} />} />
          <Route exact path='/draftboard' render={() => {
            if ((user && user.userid) || (token === 'guest')) {
              return <Draftboard />
            }
            // get profile if there is a sesssion
            if (token) {
              fetch(routes.signin, {
                method: 'POST',
                headers: {
                  'content-type': 'application/json',
                  'authorization': token
                }
              })
              .then(resp => resp.json())
              .then(user => {
                if (user && user.userid) {
                  fetch(`${routes.profile + parseInt(user.userid)}`, {
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
                      return <Draftboard />
                    }
                  })
                  .catch(err => console.log(err))
                }
              })
              .catch(err => console.log(err))
            }
          }} />
          <Route exact path={homeRoute} >
            <Redirect to='/signin' />
          </Route>
        </Switch>
      </>
    );
  }
}

export default connect(mapState, mapDispatch)(withRouter(App));