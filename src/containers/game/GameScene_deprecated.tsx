import {throttle} from 'throttle-debounce';
import {Stage} from '@pixi/react';
import {Sprite as ISprite} from 'pixi.js';
import Ball, {BallPropsInterface} from './components/Ball';
import Platform, {PlatformPropsInterface} from './components/Platform';
import {createRef, RefObject, useEffect, useLayoutEffect, useRef, useState} from 'react';
import {useSelector} from 'react-redux';
import {RootState} from '../../store';
import {KeyCode} from '../../enum/KeyCode';
import {PointType} from '../../defs/defs';
import {useMousePosition} from '../../utils/hooks';

type ConfigType = {
	stage: {[key: string]: unknown};
	ball: Pick<BallPropsInterface, 'width' | 'height'>;
	platform: Pick<PlatformPropsInterface, 'width' | 'height'> & {dx: number};
};

interface IStage extends Stage {
	app: any;
}

const GameScene = () => {
	const config: ConfigType = {
		stage: {width: 600, height: 600, raf: false, renderOnComponentChange: true, options: {backgroundColor: 0x10bb99}},
		ball: {width: 20, height: 20},
		platform: {width: 100, height: 16, dx: 5},
	};

	//------------------------------------------------------------------------------------------------------------------

	const mousePosition = useMousePosition();
	const [ballPoint, setBallPoint] = useState<PointType>({x: 0, y: 0});
	const [platformPoint, setPlatformPoint] = useState<PointType>({x: 0, y: 0});
	const [directionMovement, setDirectionMovement] = useState<PointType>({x: 0, y: 0});
	//------------------------------------------------------------------------------------------------------------------

	const gameStarted = useSelector((state: RootState) => state.arconoidGame.gameStarted);

	//------------------------------------------------------------------------------------------------------------------

	const sceneRef = createRef<HTMLDivElement>();
	const stageRef = createRef<IStage>();
	const ballRef = createRef<ISprite>();
	const platformRef = createRef<ISprite>();
	const prevMousePosition = useRef<PointType>(mousePosition);
	const animationId = useRef<number>();

	//------------------------------------------------------------------------------------------------------------------
	useLayoutEffect(() => {
		initPosition();
		return () => {
			clearAnimation();
		};
	}, []);

	useEffect(() => {
		mouseMove();
		prevMousePosition.current = mousePosition;
	}, [mousePosition]);

	useEffect(() => {
		if (!gameStarted) {
			clearAnimation();
			initPosition();
		} else {
			initDirection();
			drawGame();
		}
	}, [gameStarted]);

	//------------------------------------------------------------------------------------------------------------------

	const initPosition = () => {
		const {
			stage: {width, height},
			platform: {height: pH},
			ball: {height: bH},
		} = config;

		const centerX = (width as number) / 2;
		setPlatformPoint(() => {
			return {x: centerX, y: (height as number) - pH / 2};
		});
		setBallPoint(() => {
			return {x: centerX, y: (height as number) - pH - bH / 2};
		});
	};

	const mouseMove = () => {
		if (!gameStarted || !stageRef.current) {
			return;
		}

		const stageRect = stageRef.current?.app?.renderer?.view?.getBoundingClientRect() ?? null;
		if (!stageRect) {
			return;
		}
		const {x, y} = mousePosition;
		const {x: prevMousePosX} = prevMousePosition.current;
		const {x: xS, width: wS} = stageRect;
		const {
			platform: {width: wP, height: pH},
		} = config;

		const centerPlatform = wP / 2;
		const rightS = xS + wS;

		let pX = centerPlatform;
		if (x >= xS && x <= rightS) {
			pX = x - xS;
			if (pX - centerPlatform < 0) {
				pX = centerPlatform;
			} else if (pX + centerPlatform > wS) {
				pX = wS - centerPlatform;
			}
		} else if (x > rightS && prevMousePosX <= rightS) {
			pX = wS - centerPlatform;
		}
		if (prevMousePosX >= xS && prevMousePosX <= rightS) {
			updatePlatformPoint(pX);
		}
	};

	const updatePlatformPoint = (x: number) => {
		setPlatformPoint((prevState) => {
			return {x, y: prevState.y};
		});
	};

	const initDirection = () => {
		const x = getRandomInt(-5, 5);
		const y = getRandomInt(-5, -1);
		setDirectionMovement({x, y});
	};

	const drawGame = () => {
		// const stageRect = stageRef.current?.app?.renderer?.view?.getBoundingClientRect() ?? null;
		// console.error('>>> ballPoint', ballPoint);
		// if (!stageRect) {
		// 	return;
		// }
		// const {x: dX, y: dY} = directionMovement;
		// const {x: xS, y: yS, width: wS, height: hS} = stageRect;
		// const {
		// 	platform: {width: wP, height: pH},
		// 	ball: {width: wB},
		// } = config;
		//
		// const centerPlatform = wP / 2;
		// const rightS = xS + wS;
		// const bottomS = yS + hS;
		//
		// const newX = ballPoint.x + dX;
		// const newY = ballPoint.y + dY;
		// console.error('>>>', ballPoint);

		// if (newX >= xS && x <= rightS) {
		// 	pX = x - xS;
		// 	if (pX - centerPlatform < 0) {
		// 		pX = centerPlatform;
		// 	} else if (pX + centerPlatform > wS) {
		// 		pX = wS - centerPlatform;
		// 	}
		// } else if (x > rightS && prevMousePosX <= rightS) {
		// 	pX = wS - centerPlatform;
		// }
		// if (prevMousePosX >= xS && prevMousePosX <= rightS) {
		// 	updatePlatformPoint(pX);
		// }
		setBallPoint((prevState) => {
			return {x: prevState.x + directionMovement.x, y: prevState.y + directionMovement.y};
		});
		animationId.current = window.requestAnimationFrame(drawGame);
	};

	// const updateBallPosition = (prevState: PointType) => {
	// 	return {x: newX, y: newY};
	// };

	const getRandomInt = (min: number, max: number) => {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	};

	const clearAnimation = () => {
		if (animationId.current) {
			cancelAnimationFrame(animationId.current);
			animationId.current = undefined;
		}
	};

	//------------------------------------------------------------------------------------------------------------------

	const onKeyDown = (e: KeyboardEvent) => {
		console.error('>>> e', e);
		const {code} = e;
		const {
			stage: {width: sW},
			platform: {width: pW, dx},
		} = config;
		const {x: pX} = platformPoint;
		console.error('>>> platform', platformPoint);
		debugger;

		if (code === KeyCode.KeyA || code === KeyCode.ArrowLeft) {
			let newX = pX - dx;
			newX = newX + pW / 2 > 0 ? newX : 0;
			setPlatformPoint((prevPoint) => {
				return {x: newX, y: prevPoint.y};
			});
		}

		if (code === KeyCode.KeyD || code === KeyCode.ArrowRight) {
			let newX = pX + dx;
			newX = newX + pW / 2 <= (sW as number) - pW / 2 ? newX : (sW as number) - pW / 2;
			setPlatformPoint((prevPoint) => {
				return {x: newX, y: prevPoint.y};
			});
		}
	};

	//------------------------------------------------------------------------------------------------------------------

	return (
		<div className="GameScene" ref={sceneRef}>
			<Stage {...config.stage} ref={stageRef}>
				<Ball {...config.ball} x={ballPoint.x} y={ballPoint.y} spriteRef={ballRef} />
				<Platform {...config.platform} x={platformPoint.x} y={platformPoint.y} spriteRef={platformRef} />
			</Stage>
		</div>
	);
};

export default GameScene;
