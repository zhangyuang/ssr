import { EggAppConfig, EggAppInfo, PowerPartial } from 'egg'

export type DefaultConfig = PowerPartial<EggAppConfig>

export default (appInfo: EggAppInfo) => {
  const config: DefaultConfig = {}

  // ...

  return config
}
