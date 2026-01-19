import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {registerUser, loginUser} from "../api/userAPI"

const token = localStorage.getItem("token")

const initialState ={
    token: token || null,
    isAuthenticated: !!token,
    user: null, 
    loading: false,
    error: null,
    success: false,
}



export const registerUserThunk = createAsyncThunk(
  "auth/register",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await registerUser(formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Registration failed"
      );
    }
  }
);

export const loginUserThunk = createAsyncThunk(
    "auth/login",
    async (formData, {rejectWithValue}) =>{
        try {
            const response = await loginUser(formData)
            return response.data
            
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Login Falied"
            )
        }
    }

)

const authSlice = createSlice({
    name:"auth",
    initialState,
    reducers:{
        resetRegisterState: (state) => {
            state.loading = false,
            state.error = null,
            state.success = false
        },
        logout:(state) => {
            state.token = null
            state.isAuthenticated = false
            state.user = null
            localStorage.removeItem("token")
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(registerUserThunk.pending, (state) => {
            state.loading = true
            state.error = null
            state.success = false
        })
        .addCase(registerUserThunk.fulfilled, (state) => {
            state.loading = false
            state.success = true
        })
        .addCase(registerUserThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
        })

        // login

        .addCase(loginUserThunk.pending,(state) => {
            state.loading = true
            state.error = null
        })
        .addCase(loginUserThunk.fulfilled, (state, action) => {
            state.loading = false
            state.token = action.payload.token
            state.isAuthenticated = true
            localStorage.setItem("token", action.payload.token)

        })
        .addCase(loginUserThunk.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload
         })
    }

})

export const {resetRegisterState, logout } = authSlice.actions
export default authSlice.reducer