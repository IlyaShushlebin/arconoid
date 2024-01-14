import React from 'react';
import ReactDOM from 'react-dom/client';
import {RouterProvider} from 'react-router-dom';
import {RootRouter} from './routers/RootRouter';
import './css/index.css';
import {Provider} from 'react-redux';
import {store} from './store/store';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
	<React.StrictMode>
		<Provider store={store}>
			<RouterProvider router={RootRouter} />
		</Provider>
	</React.StrictMode>,
);
