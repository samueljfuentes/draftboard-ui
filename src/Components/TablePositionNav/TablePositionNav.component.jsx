import React from 'react';
import { connect } from 'react-redux';

import { updatePosition, toggleMyPlayers } from '../../Redux/PlayerTable/PlayerTable.actions';

import {ReactComponent as WatchlistSVG} from '../../Other/svg/watching.svg'
import './TablePositionNav.styles.scss';


const mapState = (state) => {
  return {
    position: state.playerTable.position,
    isMyPlayers: state.playerTable.isMyPlayers,
    positionTabs: state.playerTable.positionTabs
  }
};

const mapDispatch = (dispatch) => {
  return {
    setPosition: (id) => dispatch(updatePosition(id)),
    toggleMyPlayers: (isMyPlayers) => dispatch(toggleMyPlayers(isMyPlayers))
  }
};

const CenteredTabs = ({ position, isMyPlayers, positionTabs, setPosition, toggleMyPlayers }) => {
  return (
    <div className="position__nav--container">
      <div className="position__nav--inner">
        <div className="position__nav--content">
          <div className="position__nav--tabs">
            {
              positionTabs.map(tab => {
                return (
                  <button 
                    key={tab.id}
                    className={`position__nav--tab ${tab.id === position ? "position__nav--current" : null}`}
                    onClick={() => setPosition(tab.id)}
                  >
                    <span className="tab__content-wraper">{tab.id}</span>
                  </button>
                );
              })
            }
            <button
              className='position__nav--tab'
              onClick={() => toggleMyPlayers(isMyPlayers)}
            >
              <WatchlistSVG />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
};

export default connect(mapState, mapDispatch)(CenteredTabs);

