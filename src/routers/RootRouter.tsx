import {createBrowserRouter} from 'react-router-dom';
import Root from '../containers/main/Root';
import About from '../containers/About';
import ErrorPage from '../containers/main/ErrorPage';
import Main from '../containers/main/Main';
import GameRoot from '../containers/game/GameRoot';

export const RootRouter = createBrowserRouter([
	{
		path: '/',
		element: <Root />,
		errorElement: <ErrorPage />,
		children: [
			{
				index: true,
				element: <Main />,
			},
			{
				path: 'game',
				element: <GameRoot />,
			},
			{
				path: 'results',
				element: <div>Coming soon!</div>,
			},
			{
				path: 'about',
				element: <About />,
			},
		],
	},
]);
