// SORT FUNCTIONS
export const sortByRanks = (isAsc) => (players) => {
  const sortedPlayers = players.sort((a, b) => {
    if (isAsc) {
      if (a.tier < b.tier || (a.tier === b.tier && a.rank < b.rank)) {
        return -1;
      } else if (a.tier > b.tier || (a.tier === b.tier && a.rank > b.rank)) {
        return 1;
      } else {
        return 0;
      }
    } else {
      if (a.tier < b.tier || (a.tier === b.tier && a.rank > b.rank)) {
        return 1;
      } else if (a.tier > b.tier || (a.tier === b.tier && a.rank < b.rank)) {
        return -1;
      } else {
        return 0;
      }
    }
  });
  return sortedPlayers;
};

export const sortByTiers = (isAsc) => (players) => {
  const tier1 = [],
    tier2 = [],
    tier3 = [],
    tier4 = [],
    tier5 = [],
    tier6 = [],
    tier7 = [],
    tier8 = [],
    tier9 = [],
    tier10 = [];

  // group all players in proper tier array
  players.forEach((player) => {
    switch (player.tier) {
      case 1:
        return tier1.push(player);
      case 2:
        return tier2.push(player);
      case 3:
        return tier3.push(player);
      case 4:
        return tier4.push(player);
      case 5:
        return tier5.push(player);
      case 6:
        return tier6.push(player);
      case 7:
        return tier7.push(player);
      case 8:
        return tier8.push(player);
      case 9:
        return tier9.push(player);
      case 10:
        return tier10.push(player);
      default:
        break;
    }
  });

  return isAsc
    ? [tier1, tier2, tier3, tier4, tier5, tier6, tier7, tier8, tier9, tier10].flat()
    : [tier10, tier9, tier8, tier7, tier6, tier5, tier4, tier3, tier2, tier1].flat();
};

export const sortByPosition = (position) => (players) => {
  const sortedPlayers = players.filter(
    (player) => player.position === position
  );
  return sortedPlayers;
};

  // pipe the sort functions together (top/left -> btm/right), and pass the players as init value
export const pipeSortedPlayers = (...allSortCategories) => (players) => {
  return allSortCategories.reduce(
    (acc, currentFunc) => currentFunc(acc),
    players
  );
};

  // sorts players by position and order, then passes the return value of each func down the chain
export const sortPlayers = (position, isAsc) => {
  return pipeSortedPlayers(
    sortByPosition(position),
    sortByTiers(isAsc),
    sortByRanks(isAsc)
  );
};

// ORGANIZE PLAYER FUNCTIONS
export const addPlayer = async (clickEvent, allPlayers, myPlayers, user, updateMyPlayersList, updateAllPlayersList) => {
  // get the name of the player being added...
  const nodeValue = clickEvent.currentTarget.parentNode.previousSibling.textContent;
  const playerJersey = nodeValue.slice(nodeValue.indexOf('(') + 2, nodeValue.length - 1);
  const playerName = nodeValue.slice(0, nodeValue.indexOf('(') - 1);
  // determine player object...
  const player = allPlayers.filter(player => player.displayName === playerName && player.jersey === parseInt(playerJersey));
  const username = user.userid ? user.username : "guest";
  
  try {
    if (username === "guest") {
      console.log(myPlayers, 'see if this is an array')
      const newMyPlayers = Array.from(myPlayers);
      const newPlayer = Object.assign({}, player[0]);
      newPlayer.tier = 10;
      newPlayer.rank = myPlayers.length ?
        // the new players rank should be one more than the lowest ranked player of same position, ie: length + 1 
        myPlayers.filter(myPlayer => myPlayer.position === newPlayer.position).length + 1 : 
        1;
      
      newMyPlayers.push(newPlayer);
      updateMyPlayersList(newMyPlayers);
      // remove player from all players list
      const newAllPlayers = allPlayers.filter(allPlayer => allPlayer.playerId !== player[0].playerId);
      updateAllPlayersList(newAllPlayers);
    }
    else {
      // update user list...
      // add player to my player list and return updated list...
      let response = await fetch('http://localhost:3000/addplayer', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'authorization': window.sessionStorage.getItem('token')
        },
        body: JSON.stringify({
          username,
          player: {...player[0]}
        })
      });
      let newMyPlayers = await response.json();
      updateMyPlayersList(newMyPlayers);
      // remove player from all players list
      const newAllPlayers = allPlayers.filter(allPlayer => allPlayer.playerId !== player[0].playerId);
      updateAllPlayersList(newAllPlayers);
    }
  }
  catch (error) {
    console.log(error);
  }
};

export const removePlayer = async (clickEvent, allPlayers, myPlayers, user, updateMyPlayersList, updateAllPlayersList) => {
  const username = user.userid ? user.username : 'guest';
  const nodeValue = clickEvent.currentTarget.parentNode.previousSibling.textContent;
  const playerJersey = nodeValue.slice(nodeValue.indexOf('(') + 2, nodeValue.length - 1);
  const playerName = nodeValue.slice(0, nodeValue.indexOf('(') - 1);
  // determine player object...
  const player = myPlayers.filter(player => player.displayName === playerName && player.jersey === parseInt(playerJersey))[0];

  try {
    if (username === 'guest') {    
      const newMyPlayers = myPlayers.filter(myPlayer => myPlayer.playerId !== player.playerId);
      updateMyPlayersList(newMyPlayers);
      // add back to all players list
      const newAllPlayers = [player, ...allPlayers];
      updateAllPlayersList(newAllPlayers);
    }
    else {
      let response = await fetch('http://localhost:3000/removeplayer', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'authorization': window.sessionStorage.getItem('token')
        },
        body: JSON.stringify({
          username,
          player
        })
      });
      let newMyPlayers = await response.json();
      updateMyPlayersList(newMyPlayers);
      // add back to all players list
      const newAllPlayers = [player, ...allPlayers];
      updateAllPlayersList(newAllPlayers);
    }
  }
  catch (error) {
    console.log(error);
  }   
};

export const compareLists = (myPlayers, allPlayers) => {
  // check for previous myPlayers...
  if (!myPlayers.length) {
    return allPlayers
  }
  const ids = myPlayers.map(player => player.playerId)
  const newAllPlayers = allPlayers.filter(player => !ids.includes(player.playerId));
  return newAllPlayers
};

export const getPlayerLists = async (user) => {
  const token = window.sessionStorage.getItem('token');
  let players = await fetch('http://localhost:3000/draftboard', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'authorization': token
    },
    body: JSON.stringify({...user})
  }).then(data => data.json()).catch(e => null);
  
  const newPlayers = compareLists(players.myPlayers, players.allPlayers);
  
  return {
    myPlayers: players.myPlayers,
    allPlayers: newPlayers
  };
};

export const refreshPlayerOrder = async (modifiedPlayers, myPlayers, user, updateMyPlayersList) => {
  console.log('refreshing player order...')
  let myPlayerList = [...myPlayers];
  if (modifiedPlayers === null || modifiedPlayers === undefined) {
    return
  }
  // // loop through each modified player, determine their index in the main array, and replace each player with modified version
  modifiedPlayers.forEach((newPlayer) => {
    // in the main player array, find the index of each player to replace by matching id's..
    let index = myPlayerList.findIndex(
      (player) => player.playerId === newPlayer.playerId
    );
    // in the main player array, replace each (1) player at the given index with the modified player
    myPlayerList.splice(index, 1, newPlayer);
  });

  // SEND MY PLAYERS TO B/E, UPDATE D/B... ////////////////////////////////////////////////////////////
  try {
    const token = window.sessionStorage.getItem('token'); 
    const username = user.userid ? user.username : 'guest';
    if (username !== 'guest') {
      await fetch('http://localhost:3000/updatemyplayers', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'authorization': token
        },
        body: JSON.stringify({
          username,
          myPlayerList
        })
      })
      .then(response => {
        if (response.ok === false) {
          alert('something went wrong...')
          console.log(response);
        }
        else {
          return
        }
      })
      .catch(error => console.log(error));
    }
  }
  catch (err) {
    alert('failed to upload database!!');
    console.log(err);
  }

  // send action...
  updateMyPlayersList(myPlayerList);
};

export const checkModifiedPlayers = (dragPlayer, droppedOn, sortedPlayers) => {
  let playerRange; // array of players who's ranking are affected
  let newPlayerRanks; // array with updated rankings for players who are modified
  // if dragging UP onto tier row
  if (typeof droppedOn === 'number' && droppedOn <= dragPlayer.tier) {
    playerRange = sortedPlayers.filter(player => player.tier >= droppedOn && player.rank <= dragPlayer.rank);
    newPlayerRanks = playerRange.map(player => {
      return player.rank === dragPlayer.rank ?
        {
          ...player,
          tier: droppedOn,
          rank: playerRange[0].rank
        }
        :
        {
          ...player,
          rank: player.rank + 1
        }
    })
  };
  // if dragging DOWN onto tier row
  if (typeof droppedOn === 'number' && droppedOn > dragPlayer.tier) {
    playerRange = sortedPlayers.filter(player => player.tier < droppedOn && player.rank >= dragPlayer.rank);
    newPlayerRanks = playerRange.map(player => {
      return player.rank === dragPlayer.rank ?
        {
          ...player,
          tier: droppedOn,
          rank: playerRange[playerRange.length - 1].rank
        }
        :
        {
          ...player,
          rank: player.rank - 1
        }
    })
  };
  // check to see if dragging player DOWN
  if (dragPlayer.rank < droppedOn.rank) {
    // grab an array of the players to be modified...
    playerRange = sortedPlayers.slice(dragPlayer.rank - 1, droppedOn.rank);
    newPlayerRanks = playerRange.map((player) => {
      return player.rank === dragPlayer.rank
        ? {
            ...player,
            tier: droppedOn.tier,
            rank: droppedOn.rank,
          }
        : {
            ...player,
            rank: player.rank - 1,
          };
    });
  };
  // check to see if dragging player UP
  if (dragPlayer.rank > droppedOn.rank) {
    // grab an array of the players to be modified...
    playerRange = sortedPlayers.slice(droppedOn.rank - 1, dragPlayer.rank);
    newPlayerRanks = playerRange.map((player) => {
      return player.rank === dragPlayer.rank
        ? {
            ...player,
            tier: droppedOn.tier,
            rank: droppedOn.rank,
          }
        : {
            ...player,
            rank: player.rank + 1,
          };
    });
  };
  return newPlayerRanks
};

export const replacePlayer = (name = "", draggedPlayer, myPlayers, sortedMyPlayers, user, updateMyPlayerList) => {
  let modifiedPlayers;

  if (!name || name.includes('TIER')) {
    const tier = parseInt(name.slice('6'));
    modifiedPlayers = checkModifiedPlayers(draggedPlayer, tier, sortedMyPlayers);
    // *** DOUBLE CHECK TO SEE IF myPlayers IS NECESSARY BELOW, OR sortedMyPlayers CAN WORK... 
    refreshPlayerOrder(modifiedPlayers, myPlayers, user, updateMyPlayerList);
  }
  // if drop player name is different than name of current drag player, update replace player...
  else if (name !== draggedPlayer.displayName) {
    const newReplacedPlayer = myPlayers.filter(
      (player) => name.includes(player.displayName)
    );
    modifiedPlayers = checkModifiedPlayers(draggedPlayer, newReplacedPlayer[0], sortedMyPlayers);
    // *** DOUBLE CHECK TO SEE IF myPlayers IS NECESSARY BELOW, OR sortedMyPlayers CAN WORK...
    refreshPlayerOrder(modifiedPlayers, myPlayers, user, updateMyPlayerList); 
  }
  // default: do nothing
  else {
    return
  }
};

export const changeDraggedPlayer = (name, sortedMyPlayers, updateDraggedPlayer) => {

  // narrow the list of players to current position; determine which player is being dragged
  const newDraggedPlayer = sortedMyPlayers.filter(
    (player) => name.includes(player.displayName)
  );
  updateDraggedPlayer(newDraggedPlayer[0]);
};


// DRAG-N-DROP FUNCTIONS