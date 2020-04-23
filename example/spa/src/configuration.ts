import { Configuration } from '@midwayjs/decorator'

@Configuration({
  imports: [
    '@midwayjs/faas-middleware-static'
  ],
  importConfigs: [
    './config/'
  ]
})
export class ContainerConfiguration {

}
