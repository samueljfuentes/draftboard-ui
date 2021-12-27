import React from 'react';
import { connect } from 'react-redux';

import { updateMyPlayersList } from '../../Redux/PlayerTable/PlayerTable.actions';
import { sortPlayers, replacePlayer } from '../../Redux/PlayerTable/PlayerTable.utils';

import './TableTierRow.styles.scss';


const mapState = (state) => {
  return {
    myPlayers: state.playerTable.myPlayers,
    draggedPlayer: state.playerTable.draggedPlayer,
    isAsc: state.playerTable.isAsc,
    position: state.playerTable.position,
    user: state.user.user,
    routes: state.user.routes
  }
};

const mapDispatch = (dispatch) => {
  return {
    updateMyPlayersList: (myPlayers) => dispatch(updateMyPlayersList(myPlayers))
  }
};

const TierRow = ({ tier, myPlayers, draggedPlayer, isAsc, position, user, updateMyPlayersList, routes }) => {
  const sortedMyPlayers = sortPlayers(position, isAsc)(myPlayers);
  return (
    <tr className="tier__row" 
      draggable
      onDragOver={(event) => event.preventDefault()}
      // onDrop={(event) => drop(event, `TIER: ${tier}`)}
      onDrop={(event) => {
        event.preventDefault();
        replacePlayer(`TIER: ${tier}`, draggedPlayer, myPlayers, sortedMyPlayers, user, updateMyPlayersList, routes)
      }}
    >
      <th className="tier__cell" colSpan="4"> TIER: {tier} </th>
    </tr>
  )
};

export default connect(mapState, mapDispatch)(TierRow);  