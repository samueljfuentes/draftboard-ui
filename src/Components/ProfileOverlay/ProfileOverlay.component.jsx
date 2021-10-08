import React from 'react';

import { connect } from 'react-redux';

import { toggleProfile } from '../../Redux/PlayerTable/PlayerTable.actions';

import { ReactComponent as CloseSVG } from '../../Other/svg/close.svg';
import { ReactComponent as CautionSVG } from '../../Other/svg/caution.svg';
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
      <div className="profile__close" onClick={() => toggleProfile(isProfileOpen)}>
        <CloseSVG />
      </div>
      <div className="profile__card">
        <div className="profile__avatar">
          <div className="profile__avatar--text">
            USER
          </div>
        </div>
        <ul className="profile__items">
          <dl className="profile__pair">
            <dt className="profile__prop">Username:</dt>
            <dd className="profile__value">{username}</dd>
          </dl>
          <dl className="profile__pair">
            <dt className="profile__prop">Players in Draftboard:</dt>
            <dd className="profile__value">{numOfMyPlayers}</dd>
          </dl>
        </ul>
        <div className="profile__delete">
          <CautionSVG />
          <span className="profile__delete--text">
            Clear My Draftboard
          </span>
        </div>
      </div> 
    </div>
  )
};

export default connect(mapState, mapDispatch)(ProfileOverlay);