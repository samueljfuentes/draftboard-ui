import React from 'react';
import { connect } from 'react-redux';

import { updatePosition } from '../../Redux/PlayerTable/PlayerTable.actions';

import './TablePositionNav.styles.scss';


const mapState = (state) => {
  return {
    position: state.playerTable.position,
    positionTabs: state.playerTable.positionTabs,
  }
};

const mapDispatch = (dispatch) => {
  return {
    setPosition: (id) => dispatch(updatePosition(id)),
  }
};

const CenteredTabs = ({ position, positionTabs, setPosition }) => {
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
          </div>
        </div>
      </div>
    </div>
  )
};

export default connect(mapState, mapDispatch)(CenteredTabs);

