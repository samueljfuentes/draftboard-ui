import React from 'react';
import { connect } from 'react-redux';

import TierRow from '../TableTierRow/TableTierRow.component';
import MyPlayersRow from '../TableMyPlayersRow/TableMyPlayersRow.component';


const mapState = (state) => {
  return {
    tiers: state.playerTable.tiers
  }
}

const MyPlayers = ({ tiers, myPlayers, dragStart, allowDrop, drop, touchDrag, touchDrop }) => {
  return (
    tiers.map(tier => (
      <tbody className="table__body" key={tier}>
        <TierRow tier={tier} allowDrop={allowDrop} drop={drop}/>
        {myPlayers.map(player => 
          player.tier === tier ?
          (
            <MyPlayersRow 
              key={myPlayers.indexOf(player)}
              id={player.playerId}
              displayName={player.displayName}
              position={player.position}
              jersey={player.jersey}
              tier={player.tier}
              rank={player.rank}
              dragStart={dragStart}
              allowDrop={allowDrop}
              drop={drop}
              touchDrag={touchDrag}
              touchDrop={touchDrop}
            />
          ) :
          null
        )}
      </tbody>
    ))
  )
};

export default connect(mapState)(MyPlayers)