import React from 'react';

import './TableAllPlayersRow.styles.scss';

const AllPlayersRow = ({ id, displayName, jersey, addPlayer }) => {

  return (
    <tr key={id} id={id} className="table__body--row">
      <th className="table__body--cell1" scope="row">{`${displayName} (#${jersey})`}</th>
      <td className="table__body--cell"><div onClick={(click) => {addPlayer(click)}}>+</div></td>
    </tr>
  )
};

export default AllPlayersRow;