import React from 'react';
import { connect } from 'react-redux';

import { updateMyPlayersList, updateAllPlayersList } from '../../Redux/PlayerTable/PlayerTable.actions';
import { addPlayer } from '../../Redux/PlayerTable/PlayerTable.utils';

import { ReactComponent as AddSVG } from '../../Other/svg/add.svg'
import './TableAllPlayersRow.styles.scss';


const mapState = (state) => {
  return {
    allPlayers: state.playerTable.allPlayers,
    myPlayers: state.playerTable.myPlayers,
    user: state.user.user,
    routes: state.user.routes
  }
};

const mapDispatch = (dispatch) => {
  return {
    updateMyPlayersList: (myPlayers) => dispatch(updateMyPlayersList(myPlayers)),
    updateAllPlayersList: (allPlayers) => dispatch(updateAllPlayersList(allPlayers))
  }
}


const AllPlayersRow = ({ id, displayName, team, allPlayers, myPlayers, user, routes, updateMyPlayersList, updateAllPlayersList }) => {

  return (
    <tr key={id} id={id} className="table__body--row">
      <th className="table__body--cell1" scope="row">{`${displayName} (${team})`}</th>
      <td className="table__body--cell">
        <div onClick={(click) => {addPlayer(click, allPlayers, myPlayers, user, routes, updateMyPlayersList, updateAllPlayersList)}}>
          <AddSVG />
        </div>
      </td>
    </tr>
  )
};

export default connect(mapState, mapDispatch)(AllPlayersRow);