import '../../css/less/GameArea.css';
import React, {RefObject, useEffect, useRef, useState} from 'react';
import classNames from 'classnames';

export type DirectionMovementType = {
	x: number;
	y: number;
};

const GameArea = () => {
	const [gameStarted, setGameStarted] = useState<boolean>(false);
	const [directionMovement, setDirectionMovement] = useState<DirectionMovementType>({x: 0, y: 0});

	const gameAreaRef = React.createRef<HTMLDivElement>();
	const nucleusRef = React.createRef<HTMLDivElement>();
	const platformRef = React.createRef<HTMLDivElement>();

	const movingNucleusTimerRef = useRef<NodeJS.Timer>();

	const speed = 20;

	useEffect(() => {
		resetNucleusPosition();

		return () => {
			clearInterval(movingNucleusTimerRef.current);
		};
	}, []);

	//------------------------------------------------------------------------------------------------------------------

	const onGameAreaMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
		movePlatform(event);
	};

	const onGameAreaClick = () => {
		if (!gameStarted) {
			setGameStarted(true);
			startGame();
		}
	};

	const onStopGame = () => {
		stopNucleus();
	};

	//------------------------------------------------------------------------------------------------------------------

	const startGame = () => {
		initDirection();
		debugger;
		const refs = {nucleusRef, gameAreaRef};
		movingNucleusTimerRef.current = setInterval<any[]>(
			(refs: any[]) => {
				console.error(refs);
			},
			speed,
			refs,
		);
	};

	const movingNucleus = (ref: RefObject<HTMLDivElement>, ref2: RefObject<HTMLDivElement>) => {
		const nucleus = ref?.current;
		const gameArea = ref2.current;
		console.error('gameArea', gameArea);

		if (nucleus && gameArea) {
			const nucleusRect = nucleus.getBoundingClientRect();
			const gameAreaRect = gameArea.getBoundingClientRect();

			nucleus.style.left = `${nucleusRect.left + directionMovement.x - gameAreaRect.left}px`;
			nucleus.style.top = `${nucleusRect.top + directionMovement.y - gameAreaRect.top}px`;
		}
	};

	const initDirection = () => {
		const x = getRandomInt(-10, 10);
		const y = getRandomInt(-10, -1);
		setDirectionMovement({x, y});
	};

	const clearDirection = () => {
		setDirectionMovement({x: 0, y: 0});
	};

	const getRandomInt = (min: number, max: number) => {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	};

	const stopNucleus = () => {
		setGameStarted(false);
		if (movingNucleusTimerRef.current) {
			clearInterval(movingNucleusTimerRef.current);
		}
		clearDirection();
		resetNucleusPosition();
	};

	//------------------------------------------------------------------------------------------------------------------

	const movePlatform = (event: React.MouseEvent<HTMLDivElement>) => {
		const gameArea = gameAreaRef.current;
		const nucleus = nucleusRef.current;
		const platform = platformRef.current;
		if (!gameArea || !nucleus || !platform) {
			return;
		}

		const {clientX} = event;
		const gameAreaRect = gameArea.getBoundingClientRect();
		const platformRect = platform.getBoundingClientRect();
		const mousePosInGameAreaX = clientX - gameAreaRect.left;
		const pos = mousePosInGameAreaX - platformRect.width / 2;
		const posPlatformX = pos < 0 ? 0 : pos + platformRect.width <= gameAreaRect.width ? pos : gameAreaRect.width - platformRect.width;
		platform.style.left = `${posPlatformX}px`;
		if (!gameStarted) {
			nucleusToPlatform();
		}
	};

	//------------------------------------------------------------------------------------------------------------------

	const centerPlatform = () => {
		const platformRect = platformRef.current?.getBoundingClientRect();
		const gameAreaRect = gameAreaRef.current?.getBoundingClientRect();
		if (!gameAreaRect || !platformRect) {
			return;
		}

		const posPlatformX = gameAreaRect.width / 2 - platformRect.width / 2;
		if (platformRef.current) {
			platformRef.current.style.left = `${posPlatformX}px`;
		}
	};

	const nucleusToPlatform = () => {
		const platformRect = platformRef.current?.getBoundingClientRect();
		const nucleusRect = nucleusRef.current?.getBoundingClientRect();
		const gameAreaRect = gameAreaRef.current?.getBoundingClientRect();
		if (!nucleusRect || !platformRect || !gameAreaRect) {
			return;
		}

		const centerPosPlatformX = platformRect.width / 2 + platformRect.left - gameAreaRect.left;
		const posNucleusX = centerPosPlatformX - nucleusRect.width / 2;
		const posNucleusY = platformRect.top - gameAreaRect.top - nucleusRect.height;
		if (nucleusRef.current) {
			nucleusRef.current.style.left = `${posNucleusX}px`;
			nucleusRef.current.style.top = `${posNucleusY}px`;
		}
	};

	const resetNucleusPosition = () => {
		centerPlatform();
		nucleusToPlatform();
	};

	//------------------------------------------------------------------------------------------------------------------

	return (
		<>
			<div ref={gameAreaRef} className={classNames('GameArea', {game_stared: gameStarted})} onMouseMove={onGameAreaMouseMove} onClick={onGameAreaClick}>
				<div className="box" />
				<div ref={nucleusRef} className="nucleus" />
				<div className="platform-holder">
					<div ref={platformRef} className="platform" />
				</div>
			</div>

			<div className={'stop-button'} onClick={onStopGame} style={{width: '100px', height: '30px', backgroundColor: 'red', left: 0, position: 'absolute'}}>
				"Stop Game"
			</div>
		</>
	);
};

export default GameArea;
