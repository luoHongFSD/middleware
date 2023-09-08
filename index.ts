type IMiddleware = (context,next)=>Promise<any>
type IMiddlewares = Array<IMiddleware>

export class Middleware {
  middleware: IMiddlewares;
  constructor() {
    this.middleware = [];
  }

  use(fn:IMiddleware) {
    if (typeof fn !== "function") {
      throw new TypeError("middleware must be a function!");
    }
    this.middleware.push(fn);
    return this;
  }

  clear() {
    this.middleware = [];
    return this;
  }

  async run(context:any):Promise<any> {
    if (typeof context !== "object" && context !== null) {
      throw new TypeError("Context stack must be an object!");
    }
    const middleware = this.compose(this.middleware);
    await middleware(context);
    return context;
  }

  compose(middleware:IMiddlewares) {
    if (!Array.isArray(middleware))
      throw new TypeError("Middleware stack must be an array!");
    for (const fn of middleware) {
      if (typeof fn !== "function")
        throw new TypeError("Middleware must be composed of functions!");
    }

    /**
     * @param {Object} context
     * @return {Promise}
     * @api public
     */

    return function (context, next?: ()=>Promise<any>) {
      // last called middleware #
      let index = -1;
      return dispatch(0);
      function dispatch(i) {
        if (i <= index)
          return Promise.reject(new Error("next() called multiple times"));
        index = i;
        let fn = middleware[i];
        if (i === middleware.length) fn = next;
        if (!fn) return Promise.resolve();
        try {
          return Promise.resolve(fn(context, dispatch.bind(null, i + 1)));
        } catch (err) {
          return Promise.reject(err);
        }
      }
    };
  }
}
