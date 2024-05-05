import '../../css/less/GameRoot.css';
import GameArea_deprecated from './GameArea_deprecated';
import GameMenu from './GameMenu';
import GameScene from './GameScene';

const GameRoot = () => {
	return (
		<div className={'GameRoot'}>
			<GameScene />
			<GameMenu />
		</div>
	);
};

export default GameRoot;
