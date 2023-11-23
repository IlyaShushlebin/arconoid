import {NavLink} from 'react-router-dom';
import classNames from 'classnames';
import '../css/less/NavButton.css';

export interface INavButtonProps {
	className?: string;
	href: string;
	text: string;
	icon?: string;
}

export const NavButton = (props: INavButtonProps) => {
	const {className = '', href, text = '', icon = ''} = props;

	const getClassName = ({isActive, isPending}: {isActive: boolean; isPending: boolean}) => {
		return classNames('NavButton', className, {withIcon: icon !== '', active: isActive, pending: isPending});
	};

	const renderContent = () => {
		return <div>{text}</div>;
	};

	return (
		<NavLink to={href} className={getClassName}>
			<div className={'NavButton__content'}>{renderContent()}</div>
		</NavLink>
	);
};
