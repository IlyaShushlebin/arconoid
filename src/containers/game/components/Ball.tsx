import ballImg from '../../../img/ball.svg';
import {Sprite} from '@pixi/react';
import {RefObject} from 'react';
import {Sprite as ISprite} from 'pixi.js';

export interface BallPropsInterface {
	width: number;
	height: number;
	x: number;
	y: number;
	spriteRef?: RefObject<ISprite>;
}

const Ball = (props: BallPropsInterface) => {
	return <Sprite image={ballImg} anchor={0.5} {...props} ref={props.spriteRef} />;
};

export default Ball;
