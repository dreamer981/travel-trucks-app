import { configureStore } from "@reduxjs/toolkit";
import campersReducer from "../features/campers/campersSlice.js";

export const store = configureStore({
  reducer: {
    campers: campersReducer,
    // filters: filtersReducer (sonra eklenecek)
    // favorites: favoritesReducer (sonra eklenecek)
  },
});
