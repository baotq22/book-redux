import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../apiService';

// Async thunk to fetch books
export const fetchBooks = createAsyncThunk(
  'books/fetchBooks',
  async ({ pageNum, query }, { rejectWithValue }) => {
    try {
      let url = `/books?_page=${pageNum}&_limit=10`;
      if (query) url += `&q=${query}`;
      const res = await api.get(url);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk to fetch book details
export const fetchBookDetail = createAsyncThunk(
  'books/fetchBookDetail',
  async (bookId, { rejectWithValue }) => {
    try {
      const res = await api.get(`/books/${bookId}`);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk to add a book to the reading list
export const addToReadingList = createAsyncThunk(
  'books/addToReadingList',
  async (book, { rejectWithValue }) => {
    try {
      await api.post(`/favorites`, book);
      return book;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk to remove a book from the reading list
export const removeFromReadingList = createAsyncThunk(
  'books/removeFromReadingList',
  async (bookId, { rejectWithValue }) => {
    try {
      await api.delete(`/favorites/${bookId}`);
      return bookId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const booksSlice = createSlice({
  name: 'books',
  initialState: {
    books: [],
    book: null,
    loading: false,
    error: null,
    readingList: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBooks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBooks.fulfilled, (state, action) => {
        state.loading = false;
        state.books = action.payload;
      })
      .addCase(fetchBooks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchBookDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBookDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.book = action.payload;
      })
      .addCase(fetchBookDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addToReadingList.fulfilled, (state, action) => {
        state.readingList.push(action.payload);
      })
      .addCase(removeFromReadingList.fulfilled, (state, action) => {
        state.readingList = state.readingList.filter(
          (book) => book.id !== action.payload
        );
      });
  },
});

export default booksSlice.reducer;
