import { compilation } from "webpack"

declare module "webpack" {
   interface compilation {
    module :{
      resource: string
    }
   }
}