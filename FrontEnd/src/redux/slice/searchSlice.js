import { createSlice } from "@reduxjs/toolkit";

const searchSlice = createSlice({
  name: "search",
  initialState: {
    query: "",
    results: [],
  },
  reducers: {
    setQuery: (state, action) => {
      state.query = action.payload;
    },
    setResults: (state, action) => {
      state.results = action.payload;
    },
    clearResults: (state) => {
      state.results = [];
      state.query = "";
    },
  },
});

export const { setQuery, setResults, clearResults } = searchSlice.actions;

export default searchSlice.reducer;
