import { build } from './build'
import { deploy } from './deploy'
import { start } from './start'

export function serverPlugin() {
	return {
		name: 'plugin-nestjs',
		start,
		build,
		deploy
	}
}
