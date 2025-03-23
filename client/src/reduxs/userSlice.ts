import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
    user: { id: number; name: string; email: string } | null;
    token: string | null;
}

const initialState: UserState = {
    user: null,
    token: null,
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        login: (state, action: PayloadAction<{ id: number; name: string; email: string; token: string }>) => {
            state.user = { id: action.payload.id, name: action.payload.name, email: action.payload.email };
            state.token = action.payload.token;
            localStorage.setItem("token", action.payload.token);
        },
        logout: (state) => {
            state.user = null;
            state.token = null;
            localStorage.removeItem("token");
        },
        setUser: (state, action: PayloadAction<{ id: number; name: string; email: string }>) => {
            state.user = { id: action.payload.id, name: action.payload.name, email: action.payload.email };
        },
    },
});

export const { login, logout, setUser } = userSlice.actions;
export default userSlice.reducer;
