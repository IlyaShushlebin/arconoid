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
	const [grid, setGrid] = useState<{c: string; a: boolean}[][]>([
		[
			{c: 'darkblue', a: true},
			{c: 'cyan', a: true},
			{c: 'blueviolet', a: true},
			{c: 'darkblue', a: true},
		],
		[
			{c: 'cyan', a: true},
			{c: 'blueviolet', a: true},
			{c: 'darkblue', a: true},
			{c: 'cyan', a: true},
		],
	]);

	const canvasRef = React.createRef<HTMLCanvasElement>();

	const platformOptions = {
		w: 120,
		h: 14,
		c: 'orange',
		dx: 10,
	};

	const ballOptions = {
		r: 10,
		c: 'red',
	};

	useEffect(() => {
		drawGame();
	}, []);

	//------------------------------------------------------------------------------------------------------------------

	const onCanvasMouseMove = (event: MouseEvent) => {
		movePlatform(event);
	};

	const onCanvasClick = (event: MouseEvent) => {
		if (!gameStarted) {
			setGameStarted(true);
			console.log(gameStarted);

			startGame();
		}
	};

	const onStopGame = () => {
		stopNucleus();
	};

	//------------------------------------------------------------------------------------------------------------------

	const drawGame = () => {
		const holst = getHolst();
		if (holst === null) {
			return;
		}

		const {canvas} = holst;
		canvas.addEventListener('mousemove', onCanvasMouseMove);
		canvas.addEventListener('click', onCanvasClick);

		draw();
	};

	const drawPlatform = ({x, y}: {x: number; y: number}) => {
		const holst = getHolst();
		if (holst === null) {
			return;
		}
		const {context} = holst;

		const {w: platformW, h: platformH, c: platformColor} = platformOptions;

		context.beginPath();
		context.rect(x, y, platformW, platformH);
		context.fillStyle = platformColor;
		context.fill();
		context.closePath();
	};

	const drawBall = ({x, y}: {x: number; y: number}) => {
		const holst = getHolst();
		if (holst === null) {
			return;
		}
		const {context} = holst;

		const {r: ballRadius, c: ballColor} = ballOptions;

		context.beginPath();
		context.arc(x, y, ballRadius, 0, Math.PI * 2);
		context.fillStyle = ballColor;
		context.fill();
		context.closePath();
	};

	const drawGrid = () => {
		const holst = getHolst();
		if (holst === null) {
			return;
		}

		const {canvas, context} = holst;
		let cellY = 10;
		const cellH = 10;
		const cellMargin = 2;

		for (let i = 0, len = grid.length; i < len; i++) {
			const row = grid[i];
			const cellCount = row.length;
			const cellW = canvas.width / cellCount - cellMargin;
			let cellX = 1;
			for (let k = 0; k < cellCount; k++) {
				const cellData = row[k];
				if (!cellData.a) {
					cellX += cellW + cellMargin;
					continue;
				}
				context.beginPath();
				context.rect(cellX, cellY, cellW, cellH);
				context.fillStyle = cellData.c;
				context.fill();
				context.closePath();

				cellX += cellW + cellMargin;
			}
			cellY += cellH + cellMargin;
		}
	};

	const draw = () => {
		const holst = getHolst();
		if (holst === null) {
			return;
		}
		const {canvas, context} = holst;

		context.clearRect(0, 0, canvas.width, canvas.height);
		drawGrid();
		drawBall(getInitialBallPosition());
		drawPlatform(getInitialPlatformPosition());
	};

	//------------------------------------------------------------------------------------------------------------------

	const getInitialBallPosition = () => {
		let y = 0;
		let x = 0;
		const holst = getHolst();
		if (holst !== null) {
			const {canvas} = holst;
			const {r: ballRadius} = ballOptions;
			x = canvas.width / 2;
			y = canvas.height - platformOptions.h - ballRadius;
		}
		return {x, y};
	};

	const getInitialPlatformPosition = () => {
		let x = 0;
		let y = 0;

		const holst = getHolst();
		if (holst !== null) {
			const {canvas} = holst;
			const {w: platformW, h: platformH} = platformOptions;
			x = (canvas.width - platformW) / 2;
			y = canvas.height - platformH;
		}
		return {x, y};
	};

	const getHolst = () => {
		const canvas = canvasRef.current;
		const context = canvas?.getContext('2d');
		return !!canvas && !!context ? {canvas, context} : null;
	};

	//------------------------------------------------------------------------------------------------------------------

	const movePlatform = (event: MouseEvent) => {
		if (!gameStarted) {
			return;
		}
		const holst = getHolst();
		if (holst === null) {
			return;
		}
		const {canvas, context} = holst;
		context.clearRect(0, 0, canvas.width, canvas.height);

		const {pageX} = event;

		const {w: platformW, h: platformH} = platformOptions;
		const canvasRect = canvas.getBoundingClientRect();
		const platformY = canvas.height - platformH;
		let platformX = pageX - canvasRect.x - platformW / 2;
		if (platformX < 0) {
			platformX = 0;
		} else if (platformX + platformW > canvas.width) {
			platformX = canvas.width - platformW;
		}

		drawPlatform({x: platformX, y: platformY});
	};

	const gameAnimation = () => {
		if (!gameStarted) {
			return;
		}
		const holst = getHolst();
		if (holst === null) {
			return;
		}

		const {x: dx, y: dy} = directionMovement;
		drawBall({x: dx, y: dy});

		requestAnimationFrame(gameAnimation);
	};

	//------------------------------------------------------------------------------------------------------------------

	const startGame = () => {
		initDirection();
		requestAnimationFrame(gameAnimation);
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
		clearDirection();
	};

	//------------------------------------------------------------------------------------------------------------------

	return (
		<>
			<canvas ref={canvasRef} className={classNames('GameArea', {game_stared: gameStarted})} width="600" height="600" />
			<div className={'stop-button'} onClick={onStopGame} style={{width: '100px', height: '30px', backgroundColor: 'red', left: 0, position: 'absolute'}}>
				"Stop Game"
			</div>
		</>
	);
};

export default GameArea;
