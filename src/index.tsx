import { Hono } from "hono";
import { logger } from "hono/logger"
import type { FC } from "hono/jsx"

import { memo } from "hono/jsx";


const app = new Hono()

const Head: FC = () => {
  return <head>
  <link href="https://cdn.jsdelivr.net/npm/daisyui@4.10.2/dist/full.min.css" rel="stylesheet" type="text/css" />
  <script src="https://cdn.tailwindcss.com"></script>
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


app.get('/', (c) => {
  return c.html(<Home />)
})

export default app