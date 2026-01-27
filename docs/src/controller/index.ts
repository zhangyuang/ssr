import { Readable } from "stream";
import { Controller, Get, Provide, Inject } from "@midwayjs/decorator";
import { Context } from "@midwayjs/koa";
import { render } from "ssr-core";

@Provide()
@Controller("/")
export class Index {
  @Inject()
  ctx: Context;

  @Get("/")
  @Get("/docs/:page")
  @Get("/blog")
  @Get("/blog:router")
  async handler(): Promise<void> {
    try {
      const stream = await render<Readable>(this.ctx, {
        stream: false,
      });
      this.ctx.body = stream;
    } catch (error) {
      console.log(error);
      this.ctx.body = error;
    }
  }

  @Get("/zh/*")
  async handlerZh(): Promise<void> {
    try {
      const stream = await render<Readable>(this.ctx, {
        stream: false,
        prefix: "/zh",
      });
      this.ctx.body = stream;
    } catch (error) {
      console.log(error);
      this.ctx.body = error;
    }
  }
  @Get("/en/*")
  async handlerEn(): Promise<void> {
    try {
      const stream = await render<Readable>(this.ctx, {
        stream: false,
        prefix: "/en",
      });
      this.ctx.body = stream;
    } catch (error) {
      console.log(error);
      this.ctx.body = error;
    }
  }
}
