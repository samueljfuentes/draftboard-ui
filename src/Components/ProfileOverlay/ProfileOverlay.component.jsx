import React from 'react';

import { connect } from 'react-redux';

import { toggleProfile } from '../../Redux/PlayerTable/PlayerTable.actions';

import './ProfileOverlay.styles.scss';


const mapState = (state) => {
  return {
    username: state.user.user.username,
    numOfMyPlayers: state.playerTable.myPlayers.length
  }
}

const mapDispatch = (dispatch) => {
  return {
    toggleProfile: (isProfile) => dispatch(toggleProfile(isProfile)) 
  }
};

const ProfileOverlay = ({username, numOfMyPlayers, isProfileOpen, toggleProfile}) => {
  return (
    <div className="profile">
      <button className="profile__close" onClick={() => toggleProfile(isProfileOpen)}>CLOSE</button> 
      <ul className="profile__items">
        <dl className="profile__pair">
          <dt className="profile__prop">Username:</dt>
          <dd className="profile__value">{username}</dd>
        </dl>
        <dl className="profile__pair">
          <dt className="profile__prop">Players in Draftboard:</dt>
          <dd className="profile__value">{numOfMyPlayers}</dd>
        </dl>
        <button className="profile__delete">
          CLEAR DRAFTBOARD
        </button>
      </ul>
    </div>
  )
};

export default connect(mapState, mapDispatch)(ProfileOverlay);