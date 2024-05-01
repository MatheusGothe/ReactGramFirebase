import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import storieService from '../services/storieService'

const initialState = {
    stories: [],
    userStories: [],
    loading: false,
    success: false,
    error: false
}

// Get all Stories
export const getStories = createAsyncThunk(
    "stories/getStories",
    async (_, thunkAPI) => {
      const token = thunkAPI.getState().auth.user.token;
  
      const data = await storieService.getStories(null, token);
  
      // Check for erros
      if (data.errors) {
        return thunkAPI.rejectWithValue(data.errors[0]);
      }
  
      return data;
    }
  );
// Get user Stories
export const getUserStories = createAsyncThunk(
    "stories/getUserStories",
    async (id, thunkAPI) => {

      const token = thunkAPI.getState().auth.user.token;
  
      const data = await storieService.getUserStories(id, token);
  
      // Check for erros
      if (data.errors) {
        return thunkAPI.rejectWithValue(data.errors[0]);
      }
  
      return data;
    }
  );


  export const storeSlice = createSlice({
    name: "stories",
    initialState,
    reducers: {
      resetMessage: (state) => {
      },
    },
    extraReducers: (builder) => {
      builder
        .addCase(getStories.pending, (state) => {

        })
        .addCase(getStories.fulfilled, (state, action) => {
          // url = https://images.unsplash.com/photo-1493612276216-ee3925520721?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1528&q=80
          state.stories = action.payload.stories;
          state.stories = action.payload.stories.map(story => ({
            ...story,
            url: 'https://images.unsplash.com/photo-1493612276216-ee3925520721?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1528&q=80'
          }));
        })
        .addCase(getStories.rejected, (state, action) => {
            console.log(action.payload)
        })
        .addCase(getUserStories.pending, (state, action) => {
            state.loading = true
        })
        .addCase(getUserStories.rejected, (state, action) => {
            state.loading = false
        })
        .addCase(getUserStories.fulfilled, (state, action) => {
            state.success = true
            state.loading = false
            state.userStories = action.payload
        })
    }
});

export default storeSlice.reducer