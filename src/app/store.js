import { configureStore } from "@reduxjs/toolkit";
import campersReducer from "../features/campers/campersSlice";
import favoritesReducer from "../features/favorites/favoritesSlice";

export const store = configureStore({
  reducer: {
    campers: campersReducer,
    favorites: favoritesReducer,
    // filters: filtersReducer (sonra)
  },
});
