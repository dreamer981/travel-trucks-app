import { createSlice } from "@reduxjs/toolkit";

const LS_KEY = "tt_favorites";

function readFavs() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return Array.isArray(JSON.parse(raw)) ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeFavs(ids) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(ids));
  } catch {console.error();
  }
}

const initialState = {
  ids: readFavs(), // uygulama açıldığında localStorage'dan yükle
};

const favoritesSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    toggle(state, action) {
      const id = String(action.payload);
      const has = state.ids.includes(id);
      state.ids = has ? state.ids.filter((x) => x !== id) : [...state.ids, id];
      writeFavs(state.ids);
    },
  },
});

export const { toggle } = favoritesSlice.actions;

// selectors
export const selectFavoriteIds = (state) => state.favorites.ids;
export const selectIsFavorite =
  (id) =>
  (state) =>
    state.favorites.ids.includes(String(id));

export default favoritesSlice.reducer;
