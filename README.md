# Middleware

```
import Middeware from "middleware-ts"

const middeware  = new Middeware()
const ctx = {}
middeware.use(async(ctx,next)=>{
  await next()
}).use(async(ctx,next)=>{
  await next()
}).run(ctx).then((ctx)=>{

})

```

Please introduce me to a job
