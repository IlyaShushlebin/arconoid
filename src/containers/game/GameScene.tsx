import {Component, createRef, MutableRefObject, RefObject, useRef} from 'react';
import {Stage} from '@pixi/react';
import Ball, {BallPropsInterface} from './components/Ball';
import Platform, {PlatformPropsInterface} from './components/Platform';
import {Sprite as ISprite} from 'pixi.js';
import {PointType} from '../../defs/defs';
import {connect} from 'react-redux';
import {RootState} from '../../store';

export interface IGameSceneProps {
	gameStarted: boolean;
}
export interface IGameSceneState {
	ballPoint: PointType;
	platformPoint: PointType;
	directionMovement: PointType;
	prevMousePosition: PointType;
}

interface IStage extends Stage {
	app: any;
}

type ConfigType = {
	stage: {[key: string]: unknown};
	ball: Pick<BallPropsInterface, 'width' | 'height'>;
	platform: Pick<PlatformPropsInterface, 'width' | 'height'> & {dx: number};
};

export class GameScene<P extends IGameSceneProps = IGameSceneProps, S extends IGameSceneState = IGameSceneState> extends Component<P, S> {
	protected _config: ConfigType = {
		stage: {width: 600, height: 600, raf: false, renderOnComponentChange: true, options: {backgroundColor: 0x10bb99}},
		ball: {width: 20, height: 20},
		platform: {width: 100, height: 16, dx: 5},
	};

	protected _stageRef: RefObject<IStage>;

	protected _ballRef: RefObject<ISprite>;

	protected _platformRef: RefObject<ISprite>;

	protected _animationId = -1;

	constructor(props: P) {
		super(props);

		this.state = this.getFirstState();

		this._stageRef = createRef<IStage>();
		this._ballRef = createRef<ISprite>();
		this._platformRef = createRef<ISprite>();
	}

	getFirstState() {
		return {
			ballPoint: {x: 0, y: 0},
			platformPoint: {x: 0, y: 0},
			directionMovement: {x: 0, y: 0},
			prevMousePosition: {x: 0, y: 0},
		} as S;
	}

	//------------------------------------------------------------------------------------------------------------------

	componentDidMount() {
		window.addEventListener('mousemove', this.onMouseMove);
		this.initPosition();
	}

	componentDidUpdate(prevProps: Readonly<P>, prevState: Readonly<S>) {
		const {gameStarted} = this.props;
		if (prevProps.gameStarted !== gameStarted) {
			if (!gameStarted) {
				this.clearAnimation();
				this.initPosition();
			} else {
				this.initDirection();
				this.drawGame();
			}
		}
	}

	componentWillUnmount() {
		window.removeEventListener('mousemove', this.onMouseMove);
		this.clearAnimation();
	}

	//------------------------------------------------------------------------------------------------------------------

	initPosition() {
		const {
			stage: {width, height},
			platform: {height: pH},
			ball: {height: bH},
		} = this._config;

		const centerX = (width as number) / 2;
		this.setState(() => ({platformPoint: {x: centerX, y: (height as number) - pH / 2}, ballPoint: {x: centerX, y: (height as number) - pH - bH / 2}}));
	}

	initDirection() {
		const x = this.getRandomInt(-5, 5);
		const y = this.getRandomInt(-5, -1);
		this.updateDirectionMovement(x, y);
	}

	getRandomInt(min: number, max: number) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	clearAnimation() {
		if (this._animationId > -1) {
			cancelAnimationFrame(this._animationId);
			this._animationId = -1;
		}
	}

	onMouseMove = (e: MouseEvent) => {
		const {clientX, clientY} = e;
		const gameStarted = this.isGameStarted();
		if (!gameStarted || !this._stageRef.current) {
			this.updatePrevMousePosition(clientX, clientY);
			return;
		}

		const stageRect = this._stageRef.current.app.renderer.view.getBoundingClientRect();

		const {x: xS, width: wS} = stageRect;
		const {x: prevMousePosX} = this.state.prevMousePosition;
		const {
			platform: {width: wP, height: pH},
		} = this._config;

		const centerPlatform = wP / 2;
		const rightS = xS + wS;

		let pX = centerPlatform;
		if (clientX >= xS && clientX <= rightS) {
			pX = clientX - xS;
			if (pX - centerPlatform < 0) {
				pX = centerPlatform;
			} else if (pX + centerPlatform > wS) {
				pX = wS - centerPlatform;
			}
		} else if (clientX > rightS && prevMousePosX <= rightS) {
			pX = wS - centerPlatform;
		}
		if (prevMousePosX >= xS && prevMousePosX <= rightS) {
			this.updatePlatformPoint(pX);
		}
		this.updatePrevMousePosition(clientX, clientY);
	};

	drawGame = () => {
		const {directionMovement, ballPoint} = this.state;
		const {x: dX, y: dY} = directionMovement;
		const {
			stage: {width: wS, height: hS},
			ball: {width: wB},
		} = this._config;
		const radiusBall = wB / 2;

		let newX = ballPoint.x + dX;
		let newY = ballPoint.y + dY;

		if (newX - radiusBall >= 0 && newX + radiusBall <= (wS as number) && newY - radiusBall >= 0 && newY + radiusBall <= (hS as number)) {
			this.checkPlatform(newX, newY);
		}
		if (newX + radiusBall > (wS as number) || newX - radiusBall < 0) {
			newX = ballPoint.x - dX;
			this.updateDirectionMovement(dX * -1, directionMovement.y);
		}
		if (newY + radiusBall > (hS as number) || newY - radiusBall < 0) {
			newY = ballPoint.y - dY;
			this.updateDirectionMovement(directionMovement.x, dY * -1);
		}

		this.updateBallPoint(newX, newY);
		this._animationId = window.requestAnimationFrame(this.drawGame);
	};

	checkPlatform(ballX: number, ballY: number) {
		const {directionMovement, ballPoint, platformPoint} = this.state;
		const {
			stage: {width: wS, height: hS},
			platform: {width: wP, height: pH},
			ball: {width: wB},
		} = this._config;

		const centerPlatform = wP / 2;
		const leftPlatform = platformPoint.x - centerPlatform;
		const rightPlatform = platformPoint.x + centerPlatform;
		const topPlatform = platformPoint.y - centerPlatform;

		const radiusBall = wB / 2;

		if (ballY + radiusBall > topPlatform) {
		}
	}

	//------------------------------------------------------------------------------------------------------------------

	updatePlatformPoint(x: number) {
		this.setState((prevState) => ({
			platformPoint: {x, y: prevState.platformPoint.y},
		}));
	}

	updatePrevMousePosition(x: number, y: number) {
		this.setState(() => ({
			prevMousePosition: {x, y},
		}));
	}

	updateBallPoint(x: number, y: number) {
		this.setState((prevState) => ({
			ballPoint: {x, y},
		}));
	}

	updateDirectionMovement(x: number, y: number) {
		this.setState(() => ({
			directionMovement: {x, y},
		}));
	}

	//------------------------------------------------------------------------------------------------------------------

	isGameStarted() {
		return this.props.gameStarted;
	}

	//------------------------------------------------------------------------------------------------------------------

	render() {
		const {ballPoint, platformPoint} = this.state;
		return (
			<div className="GameScene">
				<Stage {...this._config.stage} ref={this._stageRef}>
					<Ball {...this._config.ball} x={ballPoint.x} y={ballPoint.y} spriteRef={this._ballRef} />
					<Platform {...this._config.platform} x={platformPoint.x} y={platformPoint.y} spriteRef={this._platformRef} />
				</Stage>
			</div>
		);
	}
}

const mapStateToProps = (state: RootState) => ({
	gameStarted: state.arconoidGame.gameStarted,
});

export default connect(mapStateToProps)(GameScene);
