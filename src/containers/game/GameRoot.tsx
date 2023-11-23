import '../../css/less/GameRoot.css';
import GameArea from './GameArea';
import GameMenu from './GameMenu';

const GameRoot = () => {
	return (
		<div className={'GameRoot'}>
			<GameArea />
			<GameMenu />
		</div>
	);
};

export default GameRoot;
