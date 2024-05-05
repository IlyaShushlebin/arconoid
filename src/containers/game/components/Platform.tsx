import {Sprite} from '@pixi/react';
import platformImg from '../../../img/platform.svg';
import {RefObject} from 'react';
import {Sprite as ISprite} from 'pixi.js';

export interface PlatformPropsInterface {
	width: number;
	height: number;
	x: number;
	y: number;
	spriteRef?: RefObject<ISprite>;
}

const Platform = (props: PlatformPropsInterface) => {
	return <Sprite image={platformImg} anchor={0.5} {...props} ref={props.spriteRef} />;
};
export default Platform;
