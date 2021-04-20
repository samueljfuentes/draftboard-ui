export const updatePosition = (id) => {
  return {
    type: "UPDATE_POSITION",
    payload: id
  };
};

export const updateSortOrder = (property, isAsc) => {
  if (property === 'tier') {
    return {
      type: "UPDATE_SORT_ORDER",
      payload: !isAsc
    }
  } 
  else {
    return {
      type: null,
      payload: null
    }
  }
};

export const updateAllPlayers = (players) => {
  return {
    type: "UPDATE_ALL_PLAYERS",
    payload: players
  }
};

export const updateAllPlayersList = (players) => {
  return {
    type: "UPDATE_ALL_PLAYERS_LIST",
    payload: players
  }
};

export const updateMyPlayersList = (myPlayers) => {
  return {
    type: "UPDATE_MY_PLAYERS_LIST",
    payload: myPlayers
  }
}

export const updateDraggedPlayer = (draggedPlayer) => {
  return {
    type: "UPDATE_DRAGGED_PLAYER",
    payload: draggedPlayer
  }
}

export const toggleMyPlayers = (isMyPlayers) => {
  return {
    type: "TOGGLE_MY_PLAYERS",
    payload: !isMyPlayers
  }
};

export const toggleProfile = (isProfile) => {
  return {
    type: "TOGGLE_PROFILE",
    payload: !isProfile
  }
}