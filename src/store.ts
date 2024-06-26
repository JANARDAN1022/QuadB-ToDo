import { configureStore } from '@reduxjs/toolkit'
import NoteReducer from './Redux/Reducers/NoteReducer'

export const store = configureStore({
  reducer: { 
   Notes:NoteReducer
},
  devTools:true
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch