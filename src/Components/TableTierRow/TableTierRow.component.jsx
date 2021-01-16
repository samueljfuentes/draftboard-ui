import React from 'react';

import './TableTierRow.styles.scss';

const TierRow = ({ tier }) => {
  return (
    <tr className="tier__row">
      <th className="tier__cell" colSpan="3">TIER: {tier}</th>
    </tr>
  )
};

export default TierRow;  