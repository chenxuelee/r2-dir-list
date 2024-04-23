import { Env } from './types';
import { renderTemplFull } from './render';
import { getSiteConfig } from './config';

import { Hono } from 'hono';
import { poweredBy } from 'hono/powered-by';
import { logger } from 'hono/logger';
import { basicAuth } from 'hono/basic-auth';
import type { FC } from 'hono/jsx';
import { Fragment } from 'hono/jsx';
import { memo } from 'hono/jsx';
import { createContext, useContext } from 'hono/jsx';
import { html } from 'hono/html';
import { jsxRenderer, useRequestContext } from 'hono/jsx-renderer';

import { prettyJSON } from 'hono/pretty-json';





/**
 * 
 *  Rewrite app with Hono.
 * 
 */


// async function listBucket(bucket: R2Bucket, options?: R2ListOptions): Promise<R2Objects> {
//     // List all objects in the bucket, launch new request if list is truncated
//     const objects: R2Object[] = [];
//     const delimitedPrefixes: string[] = [];

//     // delete limit, cursor in passed options
//     const requestOptions = {
//         ...options,
//         limit: undefined,
//         cursor: undefined,
//     };

//     var cursor = undefined;
//     while (true) {
//         const index = await bucket.list({
//             ...requestOptions,
//             cursor,
//         });
//         objects.push(...index.objects);
//         delimitedPrefixes.push(...index.delimitedPrefixes);
//         if (!index.truncated) {
//             break;
//         }
//         cursor = index.cursor;
//     }
//     return {
//         objects,
//         delimitedPrefixes,
//         truncated: false
//     };
// }




const app = new Hono()


app.use(logger());



const Head: FC = memo(() => {
  return (
    <head>
      <title>Hello Hono!</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link href="https://cdn.jsdelivr.net/npm/daisyui@4.10.2/dist/full.min.css" rel="stylesheet" type="text/css" />
      <script src="https://cdn.tailwindcss.com"></script>

    </head>
  );
})






const Footer: FC = memo(() => {
  return (
    <>
      <footer>
        <p>
          Powered by <a href="https://github.com/cmj2002/r2-dir-list">r2-dir-list</a>
        </p>
      </footer>
    </>
  );
});

const Layout: FC = (props) => {
  return (
    <html>
      <Head />
      <body>{props.children}</body>
    </html>
  )
}

const Top: FC = () => {
  return (
    <Layout>
      <div className="container  mx-auto p-5 flex  h-96">

      <div className="text-sm breadcrumbs flex-none">
  <ul>
    <li><a>Home</a></li> 
    <li><a>Documents</a></li> 
    <li>Add Document</li>
  </ul>
</div>
        <div className="flex-1">
        <h1>
        Good Man.  
        </h1>    
        </div>

        <div className="flex-1">
        <h1>
        Good Man.  
        </h1>    
        </div>

      </div>
      <Footer />
    </Layout>
  )
}

app.get('/', (c) => {
  const messages = ['Good Morning', 'Good Evening', 'Good Night']
  return c.html(<Top />)
})
//...

export default app // for Cloudflare Workers or Bun