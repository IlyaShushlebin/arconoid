import '../../css/less/GameMenu.css';
import {useDispatch, useSelector} from 'react-redux';
import {RootState, startGame, stopGame} from '../../store';

const GameMenu = () => {
	const gameStarted = useSelector((state: RootState) => state.arconoidGame.gameStarted);
	const dispatch = useDispatch();

	const onStart = () => {
		dispatch(startGame());
	};

	const onPause = () => {
		dispatch(stopGame());
	};

	return (
		<div className={'GameMenu'}>
			<button className="start" onClick={onStart} tabIndex={-1} disabled={gameStarted}>
				Start
			</button>
			<button className="pause" onClick={onPause} tabIndex={-1} disabled={!gameStarted}>
				Pause
			</button>
		</div>
	);
};

export default GameMenu;
