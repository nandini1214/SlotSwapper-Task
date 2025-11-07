import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../../api/axiosClient";
import type {User} from "./authSlice"
export interface Slot {
  id: number;
  start_time: string;
  user_id: number;
  end_time: string;
  user: User;
  status: string;
  title:string
}

export interface SwapRequest {
  id: number;
  requester_id: number;
  receiver_id: number;
  my_slot_id: number;
  their_slot_id: number;
  status: string;
}

interface SwapState {
  swappableSlots: Slot[];
  requests: SwapRequest[];
  loading: boolean;
  error: string | null;
  success: string | null;
}

const initialState: SwapState = {
  swappableSlots: [],
  requests: [],
  loading: false,
  error: null,
  success: null,
};

// ✅ Get all available swappable slots
export const fetchSwappableSlots = createAsyncThunk(
  "swap/fetchSwappableSlots",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosClient.get("/api/swappable-slots");
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.detail || "Failed to fetch slots");
    }
  }
);

// ✅ Create a swap request
export const createSwapRequest = createAsyncThunk(
  "swap/createSwapRequest",
  async (
    { my_slot_id, their_slot_id }: { my_slot_id: number; their_slot_id: number },
    { rejectWithValue }
  ) => {
    try {
      const res = await axiosClient.post("/api/swap-request", { my_slot_id, their_slot_id });
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.detail || "Failed to create swap request");
    }
  }
);

// ✅ Get all incoming swap requests
export const fetchSwapRequests = createAsyncThunk(
  "swap/fetchSwapRequests",
  async (filter: "incoming" | "outgoing", { rejectWithValue }) => {
    try {
      const res = await axiosClient.get(`/api/swap-requests?type=${filter}`);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.detail || "Failed to fetch swap requests");
    }
  }
);

// ✅ Respond to swap request (accept/reject)
export const respondSwapRequest = createAsyncThunk(
  "swap/respondSwapRequest",
  async (
    { request_id, accept }: { request_id: number; accept: boolean },
    { rejectWithValue }
  ) => {
    try {
      const res = await axiosClient.post(`/api/swap-response/${request_id}`, { accept });
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.detail || "Failed to respond to request");
    }
  }
);

const swapSlice = createSlice({
  name: "swap",
  initialState,
  reducers: {
    clearSwapStatus: (state) => {
      state.success = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSwappableSlots.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSwappableSlots.fulfilled, (state, action) => {
        state.loading = false;
        state.swappableSlots = action.payload;
      })
      .addCase(fetchSwappableSlots.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(createSwapRequest.fulfilled, (state) => {
        state.success = "Swap request sent successfully!";
      })
      .addCase(createSwapRequest.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      .addCase(fetchSwapRequests.fulfilled, (state, action) => {
        state.requests = action.payload;
      })

      .addCase(respondSwapRequest.fulfilled, (state, action) => {
        state.success = `Swap request ${action.payload.status}`;
      })
      .addCase(respondSwapRequest.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { clearSwapStatus } = swapSlice.actions;
export default swapSlice.reducer;
