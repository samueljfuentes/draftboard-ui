// IMPORT LIBARARIES
import React from 'react';

// IMPORT COMPONENTS
import SignIn from '../../Components/SignIn/SignIn.component';
import SignUp from '../../Components/SignUp/SignUp.component';

// IMPORT STYLES
import './LandingPage.styles.scss';

// LANDING PAGE COMPONENT
const LandingPage = ({ route, loadUser, refreshRoute }) => {


  return (
    <div className="landing-page">
      <div className="landing-page__content">
        {
          route === 'signin' ?
          <SignIn loadUser={loadUser} refreshRoute={refreshRoute} /> :
          <SignUp loadUser={loadUser} refreshRoute={refreshRoute} />
        }
      </div>
    </div>
  )
};

export default LandingPage;