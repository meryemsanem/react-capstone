import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const apiUrl = 'https://api.spacexdata.com/v3/missions';

const initialState = {
  loading: false,
  missions: [],
  error: '',
};

const getData = (data) => data.map((mission) => ({
  id: mission.mission_id,
  name: mission.mission_name,
  description: mission.description,
}));
export const fetchMissions = createAsyncThunk('missions/fetchMissions', async () => {
  try {
    const response = await axios.get(apiUrl);
    const { data } = response;
    return getData(data);
  } catch (error) {
    throw Error(error);
  }
});

const missionsSlice = createSlice({
  name: 'missions',
  initialState,
  reducers: {
    joinMission(state, action) {
      const id = action.payload;
      const missionAdd = state.missions.map((mission) => {
        if (mission.id !== id) return mission;
        return { ...mission, reserved: true };
      });
      return { ...state, missions: missionAdd };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchMissions.pending, (state) => ({
      ...state,
      loading: true,
    }))
      .addCase(fetchMissions.fulfilled, (state, action) => ({
        ...state,
        loading: false,
        missions: action.payload,
      }))
      .addCase(fetchMissions.rejected, (state, action) => ({
        ...state,
        loading: false,
        error: action.error.message,
      }));
  },
});

export const { joinMission } = missionsSlice.actions;
export default missionsSlice.reducer;
