import React from 'react';
import { connect } from 'react-redux';

import TierRow from '../TableTierRow/TableTierRow.component';
import MyPlayersRow from '../TableMyPlayersRow/TableMyPlayersRow.component';

import { sortByPosition } from '../../Redux/PlayerTable/PlayerTable.utils';


const mapState = (state) => {
  return {
    myPlayers: state.playerTable.myPlayers,
    position: state.playerTable.position,
    tiers: state.playerTable.tiers,
  }
}

const MyPlayers = ({ myPlayers, position, tiers, removePlayer, dragStart, allowDrop, drop, touchDrag, touchDrop }) => {
  const sortedMyPlayers = sortByPosition(position, myPlayers);
  return (
    <tbody className="table__body">
    {
      // first render each tier...
      tiers.map(tier => {
        return (
          <React.Fragment>
            <TierRow tier="tier" />
            {
              // underneath each tier, render the players that match that tier
              sortedMyPlayers.map(myPlayer => {
                return myPlayer.tier === tier ?
                  <MyPlayersRow 
                    key={myPlayer.playerId}
                    id={myPlayer.playerId}
                    displayName={myPlayer.displayName}
                    jersey={myPlayer.jersey}
                    tier={myPlayer.tier}
                    rank={myPlayer.rank}
                  />
                  :
                  null
              })
            }
          </React.Fragment>
        )
      })
    }
    </tbody>
  )
};

export default connect(mapState)(MyPlayers)