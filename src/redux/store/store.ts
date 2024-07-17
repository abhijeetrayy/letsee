import { configureStore } from '@reduxjs/toolkit'
import countSLice from '@/features/count/countSlice'

export const makeStore =()=> configureStore({
  reducer: {
    counter: countSLice,
  },
})

export type AppStore = ReturnType<typeof makeStore>
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']