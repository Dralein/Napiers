import { createSlice } from "@reduxjs/toolkit";

export const loginSlice = createSlice({
  name: "login",
  initialState: {
    userToken: null,
    userProfil: null,
    logged: false,
    admin: false,
  },
  reducers: {
    storeToken: (state, action) => {
      state.userToken = action.payload;
    },

    setLogged: (state) => {
      state.logged = true;
    },

    logoutUser: (state) => {
      state.userToken = null;
      state.userProfil = null;
      state.logged = false;
      state.admin = false;
    },

    infoUser: (state, action) => {
      state.userProfil = action.payload;
    },

    setAdmin: (state, action) => {
      state.admin = action.payload;
    },
  },
});

export const { storeToken, setLogged, logoutUser, infoUser, setAdmin } =
  loginSlice.actions;

export default loginSlice;
