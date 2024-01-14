import {configureStore, createSlice} from '@reduxjs/toolkit';
import {UpdateGameStartStateType} from '../defs/store';

//------------------------------------------------------------------------------------------------------------------

const updateGameStartInitialState: UpdateGameStartStateType = {value: false};

export const updateGameStartSlice = createSlice({
	name: 'updateGameStart',
	initialState: updateGameStartInitialState,
	reducers: {
		startGame: (state) => {
			state.value = true;
		},
		stopGame: (state) => {
			state.value = false;
		},
		toggledGame: (state) => {
			state.value = !state.value;
		},
	},
});

export const {startGame, stopGame, toggledGame} = updateGameStartSlice.actions;

//------------------------------------------------------------------------------------------------------------------

export const store = configureStore({
	reducer: {gameStart: updateGameStartSlice.reducer},
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
