import React from 'react';

import { connect } from 'react-redux';

import { toggleProfile } from '../../Redux/PlayerTable/PlayerTable.actions';

import './ProfileOverlay.styles.scss';


const mapDispatch = (dispatch) => {
  return {
    toggleProfile: (isProfile) => dispatch(toggleProfile(isProfile)) 
  }
};

const ProfileOverlay = ({isProfileOpen, toggleProfile}) => {
  return (
    <div className="profile-overlay">
      {'OVERLAY PRESENT!'}
      <button onClick={() => toggleProfile(isProfileOpen)}>CLOSE</button> 
    </div>
  )
};

export default connect(null, mapDispatch)(ProfileOverlay);