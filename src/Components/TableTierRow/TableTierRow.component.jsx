import React from 'react';

import './TableTierRow.styles.scss';

const TierRow = ({ tier, allowDrop, drop }) => {
  return (
    <tr className="tier__row" 
      draggable
      onDragOver={(event) => allowDrop(event)}
      onDrop={(event) => drop(event, `TIER: ${tier}`)}
    >
      <th className="tier__cell" colSpan="4"> TIER: {tier} </th>
    </tr>
  )
};

export default TierRow;  