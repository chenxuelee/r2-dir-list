import { Hono } from "hono";
import { logger } from "hono/logger"
import type { FC } from "hono/jsx"

import { memo } from "hono/jsx";

import { cssStyles } from "./static";

import { clientJs } from "./static";


const app = new Hono()

const Head: FC = () => {
  return <head>
  <link href="https://cdn.jsdelivr.net/npm/daisyui@4.10.2/dist/full.min.css" rel="stylesheet" type="text/css" />
  <script src="https://cdn.tailwindcss.com"></script>

  <link rel="stylesheet" type="text/css" href="/css/styles.css"></link>
    <title>R2-Dir-List</title>
  </head>
}


const Root: FC = (props) => {
return <html lang="en-US">
<Head />

<body className="container flex flex-col">

{props.children}

</body>
    </html>
}


const Home: FC = () => {
    return <Root>
    <div className="text-lg breadcrumbs ml-4 my-8">
  <ul>
    <li><a>Home</a></li> 
    <li><a>Documents</a></li> 
    <li>Add Document</li>
  </ul>
</div>
    </Root>
} 

app.use(logger())


app.get("/client.js", (c) => {

  c.header('Content-Type', 'text/javascript')

return c.body(clientJs)

})


app.get("/home/", (c) => {

  const html= `
  
<!DOCTYPE html >
<html>
<head>
<meta charset=utf-8" />
<title>统计包含“a”或“A”的字符串的个数</title>
<script type="module" src="/client.js"></script>
</head>
<body>

</body>
</html>


  `

  return c.html(html)
})

app.post('/api/query/', async (c) => {

  const body = await c.req.json()
  console.log(body)
  body.email="@1024"
   return c.json(body)
})


app.get('/', (c) => {
  return c.html(<Home />)
})


app.get('/css/styles.css', (c) => {
  c.header('Content-Type', 'text/css')
  return c.text('body { background-color: red; }')
})

export default app