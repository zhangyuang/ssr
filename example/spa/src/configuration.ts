import { Configuration } from '@midwayjs/decorator'

@Configuration({
  imports: [
    '@midwayjs/faas-middleware-static'
  ]
})
export class ContainerConfiguration {

}
