import React from 'react';
import { connect } from 'react-redux';

import { updateMyPlayersList, updateAllPlayersList } from '../../Redux/PlayerTable/PlayerTable.actions';
import { addPlayer } from '../../Redux/PlayerTable/PlayerTable.utils';

import './TableAllPlayersRow.styles.scss';


const mapState = (state) => {
  return {
    allPlayers: state.playerTable.allPlayers,
    myPlayers: state.playerTable.myPlayers,
    user: state.user.user,
  }
};

const mapDispatch = (dispatch) => {
  return {
    updateMyPlayersList: (myPlayers) => dispatch(updateMyPlayersList(myPlayers)),
    updateAllPlayersList: (allPlayers) => dispatch(updateAllPlayersList(allPlayers))
  }
}


const AllPlayersRow = ({ id, displayName, jersey, allPlayers, myPlayers, user, updateMyPlayersList, updateAllPlayersList }) => {

  return (
    <tr key={id} id={id} className="table__body--row">
      <th className="table__body--cell1" scope="row">{`${displayName} (#${jersey})`}</th>
      <td className="table__body--cell"><div onClick={(click) => {addPlayer(click, allPlayers, myPlayers, user, updateMyPlayersList, updateAllPlayersList)}}>+</div></td>
    </tr>
  )
};

export default connect(mapState, mapDispatch)(AllPlayersRow);