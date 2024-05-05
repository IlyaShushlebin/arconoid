import {configureStore, createSlice} from '@reduxjs/toolkit';
import {ArconoidGameStateType} from '../defs/store';

//------------------------------------------------------------------------------------------------------------------

const arconoidGameInitialState: ArconoidGameStateType = {gameStarted: false, platformPoint: {x: 0, y: 0}, ballPoint: {x: 0, y: 0}};

export const arconoidGameSlice = createSlice({
	name: 'arconoidGameSlice',
	initialState: arconoidGameInitialState,
	reducers: {
		startGame: (state) => {
			state.gameStarted = true;
		},
		stopGame: (state) => {
			state.gameStarted = false;
		},
		changePlatformPoint: (state, action) => {
			state.platformPoint = action.payload.point;
		},
		changeBallPoint: (state, action) => {
			state.ballPoint = action.payload.point;
		},
	},
});

export const {startGame, stopGame, changePlatformPoint, changeBallPoint} = arconoidGameSlice.actions;

//------------------------------------------------------------------------------------------------------------------

export const store = configureStore({
	reducer: {arconoidGame: arconoidGameSlice.reducer},
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export default store;
