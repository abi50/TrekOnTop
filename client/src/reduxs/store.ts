import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import recommendationForm from "./recommendationFormSlice";

const store = configureStore({
    reducer: {
        user: userReducer,
        recommendation: recommendationForm,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;

