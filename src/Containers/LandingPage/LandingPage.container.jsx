// IMPORT LIBARARIES
import React from 'react';

// IMPORT COMPONENTS
import SignIn from '../../Components/SignIn/SignIn.component';
import SignUp from '../../Components/SignUp/SignUp.component';

// IMPORT STYLES
import './LandingPage.styles.scss';

// LANDING PAGE COMPONENT
const LandingPage = ({ route, loadUser, refreshRoute, apiRoutes }) => {


  return (
    <div className="landing-page">
      {
        route === 'signin' ?
        <SignIn loadUser={loadUser} refreshRoute={refreshRoute} routes={apiRoutes} /> :
        <SignUp loadUser={loadUser} refreshRoute={refreshRoute} routes={apiRoutes} />
      }
    </div>
  )
};

export default LandingPage;