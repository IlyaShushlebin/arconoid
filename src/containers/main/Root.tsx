import '../../css/less/Root.css';
import Navigation from '../Navigation';
import {Outlet} from 'react-router';

const Root = () => {
	return (
		<div className="Root">
			<Navigation />
			<Outlet />
		</div>
	);
};

export default Root;
