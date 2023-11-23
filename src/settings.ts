import {Pages} from './enum/Pages';
import {NavButtonItemType} from './react-app-env';

export const navigationButtons: NavButtonItemType[] = [
	{key: Pages.MAIN, name: 'Main', href: '/'},
	{key: Pages.GAME, name: 'Game', href: '/game'},
	{key: Pages.RESULTS, name: 'Results', href: '/results'},
	{key: Pages.ABOUT, name: 'About', href: '/about'},
];
