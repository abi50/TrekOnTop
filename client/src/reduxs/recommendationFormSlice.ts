import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface RecommendationFormState {
  placeName: string;
  categoryId: number | null;
  cityName: string;
  countryName: string;
  countryCode: string;
  latitude: number | null;
  longitude: number | null;
  title: string;
  description: string;
  files: File[];
}

const initialState: RecommendationFormState = {
  placeName: "",
  categoryId: null,
  cityName: "",
  countryCode: "",
  countryName: "",
  latitude: null,
  longitude: null,
  title: "",
  description: "",
  files: [],
};

const recommendationFormSlice = createSlice({
  name: "recommendationForm",
  initialState,
  reducers: {
    setPlaceName: (state, action: PayloadAction<string>) => {
      state.placeName = action.payload;
    },
    setCategoryId: (state, action: PayloadAction<number>) => {
      state.categoryId = action.payload;
    },
    setCityName: (state, action: PayloadAction<string>) => {
      state.cityName = action.payload;
    },
    setCountryCode: (state, action: PayloadAction<string>) => {
      state.countryCode = action.payload;
    },
    setCountryName: (state, action: PayloadAction<string>) => {
      state.countryName = action.payload;
    },
    setLatitudeLongitude: (state, action: PayloadAction<{latitude: number, longitude: number}>) => {
      state.latitude = action.payload.latitude;
      state.longitude = action.payload.longitude;
    },
    setTitle: (state, action: PayloadAction<string>) => {
      state.title = action.payload;
    },
    setDescription: (state, action: PayloadAction<string>) => {
      state.description = action.payload;
    },
    addFile: (state, action: PayloadAction<File>) => {
      state.files.push(action.payload);
    },
    clearForm: (state) => {
      Object.assign(state, initialState);
    },
    fillForm: (state, action: PayloadAction<Partial<RecommendationFormState>>) => {
      Object.assign(state, action.payload);
    },
  },
});

export const {
  setPlaceName,
  setCategoryId,
  setCityName,
  setCountryCode,
  setCountryName,
  setLatitudeLongitude,
  setTitle,
  setDescription,
  addFile,
  clearForm,
  fillForm,
} = recommendationFormSlice.actions;

export default recommendationFormSlice.reducer;
