import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchCampersApi, fetchCamperByIdApi } from "../../services/campersApi";

/**
 * Listeyi çeker. page/limit ve filtreler parametre olarak verilir.
 * Örn: dispatch(fetchCampers({ page: 1, limit: 12, location: "Kyiv", ac: true }))
 */
export const fetchCampers = createAsyncThunk(
  "campers/fetchCampers",
  async (params, { rejectWithValue }) => {
    try {
      const data = await fetchCampersApi(params);
      return { ...data, params };
    } catch (err) {
      return rejectWithValue(err?.message || "Failed to fetch campers");
    }
  }
);

/** Detay için tek kaydı çeker */
export const fetchCamperById = createAsyncThunk(
  "campers/fetchCamperById",
  async (id, { rejectWithValue }) => {
    try {
      const camper = await fetchCamperByIdApi(id);
      return camper;
    } catch (err) {
      return rejectWithValue(err?.message || "Failed to fetch camper");
    }
  }
);

const initialState = {
  items: [],
  page: 1,
  limit: 12,
  total: undefined,   // backenden gelirse doldururuz
  hasMore: true,
  status: "idle",     // idle | loading | succeeded | failed
  error: null,

  // Detay cache'i
  byId: {},
  detailsStatus: "idle",
  detailsError: null,
};

const campersSlice = createSlice({
  name: "campers",
  initialState,
  reducers: {
    /** Filtre değişiminde listeyi sıfırlamak için */
    resetList(state) {
      state.items = [];
      state.page = 1;
      state.total = undefined;
      state.hasMore = true;
      state.status = "idle";
      state.error = null;
    },
    /** İstersen limit ayarı */
    setLimit(state, action) {
      state.limit = action.payload ?? 12;
    },
  },
  extraReducers: (builder) => {
    // LISTE
    builder
      .addCase(fetchCampers.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchCampers.fulfilled, (state, action) => {
        const { items, total, params } = action.payload;
        const nextPage = params?.page ?? 1;
        const limit = params?.limit ?? state.limit;

        if (nextPage === 1) {
          state.items = items;
        } else {
          state.items = [...state.items, ...items];
        }

        state.page = nextPage;
        state.limit = limit;
        state.total = total;

        // hasMore hesabı: total varsa ona göre, yoksa gelen boyuta göre
        if (typeof total === "number") {
          const loaded = state.items.length;
          state.hasMore = loaded < total;
        } else {
          state.hasMore = items.length === limit; // total yoksa tahmin
        }

        state.status = "succeeded";
      })
      .addCase(fetchCampers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Unknown error";
      });

    // DETAY
    builder
      .addCase(fetchCamperById.pending, (state) => {
        state.detailsStatus = "loading";
        state.detailsError = null;
      })
      .addCase(fetchCamperById.fulfilled, (state, action) => {
        const camper = action.payload;
        state.byId[camper.id] = camper;
        state.detailsStatus = "succeeded";
      })
      .addCase(fetchCamperById.rejected, (state, action) => {
        state.detailsStatus = "failed";
        state.detailsError = action.payload || "Unknown error";
      });
  },
});

export const { resetList, setLimit } = campersSlice.actions;

// SELECTOR’lar (kolay kullanım için)
export const selectCampers = (state) => state.campers.items;
export const selectCampersStatus = (state) => state.campers.status;
export const selectCampersHasMore = (state) => state.campers.hasMore;
export const selectCampersPage = (state) => state.campers.page;
export const selectCamperById = (id) => (state) => state.campers.byId[id];

export default campersSlice.reducer;
