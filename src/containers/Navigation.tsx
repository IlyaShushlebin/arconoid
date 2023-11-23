import '../css/less/Navigation.css';
import {navigationButtons} from '../settings';
import {NavButton} from '../components/NavButton';
import {NavButtonItemType} from '../react-app-env';

const Navigation = () => {
	const renderNavButton = ({href, name, key}: NavButtonItemType) => {
		return <NavButton key={key} href={href} text={name} />;
	};

	return <div className={'Navigation'}>{navigationButtons.map(renderNavButton)}</div>;
};

export default Navigation;
