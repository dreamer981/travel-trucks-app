    import { configureStore } from "@reduxjs/toolkit";

export const store = configureStore({
  reducer: {
    // buraya slice'larımızı ekleyeceğiz
    // ör: campers: campersReducer
  },
});
