import React from 'react';

const MyPlayersRow = ({ 
  id, displayName, jersey, tier, rank, removePlayer, dragStart, allowDrop, drop, touchDrag, touchDrop 
}) => {
  return (
    <tr 
      className="table__body--row"
      draggable
      onDragStart={() => dragStart(displayName)}
      onDragOver={(click) => allowDrop(click)}
      onDrop={(click) => drop(click, displayName)}
      onTouchStart={(click) => touchDrag(click)}
      onTouchEnd={(click) => touchDrop(click)}
    >
      <th className="table__body--cell1">{displayName} (#{jersey})</th>
      <td className="table__body--cell"><div onClick={(click) => removePlayer(click)}> - </div></td>
      <td className="table__body--cell">{tier}</td>
      <td className="table__body--cell">{rank}</td>
    </tr>
  )
};

export default MyPlayersRow;