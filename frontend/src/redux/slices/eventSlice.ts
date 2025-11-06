import { createSlice, createAsyncThunk, type    PayloadAction } from "@reduxjs/toolkit";
import axiosClient from "../../api/axiosClient";

// =============================
// Types
// =============================
export interface Event {
  id: number;
  title: string;
  start_time: string;
  end_time: string;
  status: "BUSY" | "SWAPPABLE" | "SWAP_PENDING";
  user_id?: number;
}

interface EventState {
  events: Event[];
  loading: boolean;
  error: string | null;
}

// =============================
// Initial State
// =============================
const initialState: EventState = {
  events: [],
  loading: false,
  error: null,
};

// =============================
// Async Thunks
// =============================

// GET /events/
export const fetchEvents = createAsyncThunk("events/fetchEvents", async (_, { rejectWithValue }) => {
  try {
    const res = await axiosClient.get("/events/");
    return res.data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.detail || "Failed to fetch events");
  }
});

export const fetchEventById = createAsyncThunk(
  "event/fetchEventById",
  async (event_id: number, { rejectWithValue }) => {
    try {
      const res = await axiosClient.get(`/events/${event_id}`);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.detail || "Failed to fetch event details"
      );
    }
  }
);

// POST /events/
export const createEvent = createAsyncThunk(
  "events/createEvent",
  async (
    { title, start_time, end_time, status }: { title: string; start_time: string; end_time: string; status?: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await axiosClient.post("/events/", {
        title,
        start_time,
        end_time,
        status: status || "BUSY",
      });
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.detail || "Failed to create event");
    }
  }
);

// PUT /events/{id}
export const updateEvent = createAsyncThunk(
  "events/updateEvent",
  async (
    { id, title, start_time, end_time, status }: { id: number; title: string; start_time: string; end_time: string; status: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await axiosClient.put(`/events/${id}`, {
        title,
        start_time,
        end_time,
        status,
      });
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.detail || "Failed to update event");
    }
  }
);

// DELETE /events/{id}
export const deleteEvent = createAsyncThunk("events/deleteEvent", async (id: number, { rejectWithValue }) => {
  try {
    await axiosClient.delete(`/events/${id}`);
    return id;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.detail || "Failed to delete event");
  }
});

// =============================
// Slice
// =============================
const eventSlice = createSlice({
  name: "events",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch events
      .addCase(fetchEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEvents.fulfilled, (state, action: PayloadAction<Event[]>) => {
        state.loading = false;
        state.events = action.payload;
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Create event
      .addCase(createEvent.fulfilled, (state, action: PayloadAction<Event>) => {
        state.events.push(action.payload);
      })

      // Update event
      .addCase(updateEvent.fulfilled, (state, action: PayloadAction<Event>) => {
        const index = state.events.findIndex((e) => e.id === action.payload.id);
        if (index !== -1) {
          state.events[index] = action.payload;
        }
      })

      // Delete event
      .addCase(deleteEvent.fulfilled, (state, action: PayloadAction<number>) => {
        state.events = state.events.filter((e) => e.id !== action.payload);
      });
  },
});

export default eventSlice.reducer;
