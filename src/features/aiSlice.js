import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { askIslamicAI } from "../services/aiApi";

// Thunk untuk mengirim pesan
export const sendMessageToAI = createAsyncThunk(
  "ai/sendMessage",
  async (userMessage, { getState, rejectWithValue }) => {
    try {
      const { messages } = getState().ai;

      // Tambahkan pesan user ke history sementara untuk dikirim ke API
      const newHistory = [...messages, { role: "user", content: userMessage }];

      const aiResponse = await askIslamicAI(newHistory);

      // Kembalikan pesan user dan response AI
      return { userMessage, aiResponse };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

const aiSlice = createSlice({
  name: "ai",
  initialState: {
    messages: [], // Format: { role: 'user'/'assistant', content: '...' }
    loading: false,
    error: null,
  },
  reducers: {
    // Aksi untuk mengosongkan chat
    clearChat: (state) => {
      state.messages = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendMessageToAI.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendMessageToAI.fulfilled, (state, action) => {
        state.loading = false;
        // Simpan pesan user
        state.messages.push({
          role: "user",
          content: action.payload.userMessage,
        });
        // Simpan balasan AI
        state.messages.push({
          role: "assistant",
          content: action.payload.aiResponse,
        });
      })
      .addCase(sendMessageToAI.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        // Tetap simpan pesan user meski gagal, tapi tandai error
        state.messages.push({ role: "user", content: action.meta.arg });
        state.messages.push({
          role: "assistant",
          content: `Maaf, terjadi kesalahan: ${action.payload}`,
        });
      });
  },
});

export const { clearChat } = aiSlice.actions;
export default aiSlice.reducer;
