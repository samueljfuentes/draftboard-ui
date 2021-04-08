import React from 'react';
import { connect } from 'react-redux';

import AllPlayersRow from '../TableAllPlayersRow/TableAllPlayersRow.component';

import { sortByPosition } from '../../Redux/PlayerTable/PlayerTable.utils'

import './TableAllPlayers.styles.scss';


const mapState = (state) => {
  return {
    allPlayers: state.playerTable.allPlayers,
    position: state.playerTable.position,
  }
};

const AllPlayers = ({ allPlayers, position }) => {
  const allSortedPlayers = sortByPosition(position, allPlayers);
  return (
    <tbody className="table__body">
      {
        allPlayers.map(player => (
          <AllPlayersRow 
            key={player.playerId}
            id={player.playerId}
            displayName={player.displayName}
            jersey={player.jersey}
            allPlayers={allSortedPlayers}
          />
        ))
      }
    </tbody>
  )
};

export default connect(mapState)(AllPlayers);