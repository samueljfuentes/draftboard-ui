import React from 'react';

import AllPlayersRow from '../TableAllPlayersRow/TableAllPlayersRow.component';

import { sortByPosition } from '../../Redux/PlayerTable/PlayerTable.utils'

import './TableAllPlayers.styles.scss';


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

export default AllPlayers;