import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PlaceDto } from "../types";

interface PlaceState {
  selectedPlace: PlaceDto | null;
}

const initialState: PlaceState = {
  selectedPlace: null,
};

const placeSlice = createSlice({
  name: "place",
  initialState,
  reducers: {
    selectPlace: (state, action: PayloadAction<PlaceDto>) => {
      state.selectedPlace = action.payload;
    },
    clearSelectedPlace: (state) => {
      state.selectedPlace = null;
    },
  },
});

export const {
  selectPlace,
  clearSelectedPlace,
} = placeSlice.actions;

export default placeSlice.reducer;
