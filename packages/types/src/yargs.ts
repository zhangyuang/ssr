
import type { Arguments } from 'yargs'

export type Argv = Arguments<{
  tencent?: boolean
  vite?: boolean
  test?: boolean
  noclean?: boolean
  showArgs?: boolean
  analyze?: boolean
  html?: boolean
  port?: string | number
  legacy?: boolean
  react?: boolean
  vue?: boolean
  vue3?: boolean
  web?: boolean
  api?: boolean
  ssg?: boolean
  ssl?: boolean
  optimize?: boolean
}>
