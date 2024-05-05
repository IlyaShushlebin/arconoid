import {useEffect, useState} from 'react';
import {PointType} from '../defs/defs';

export const useMousePosition = () => {
	const [point, setPoint] = useState<PointType>({x: 0, y: 0});

	useEffect(() => {
		const setEventPosition = (e: MouseEvent) => {
			setPoint({x: e.clientX, y: e.clientY});
		};

		window.addEventListener('mousemove', setEventPosition);

		return () => {
			window.removeEventListener('mousemove', setEventPosition);
		};
	});

	return point;
};
