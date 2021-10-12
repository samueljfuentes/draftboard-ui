export const setUser = (user) => {
  return {
    type: "SET_USER",
    payload: user
  }
};

export const setRoutes = (routes) => {
  return {
    type: "SET_ROUTES",
    payload: routes
  }
};