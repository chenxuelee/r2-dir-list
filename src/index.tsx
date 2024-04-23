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


const Layout: FC = (props) => {
    return (
      <html>
        <body>{props.children}</body>
      </html>
    )
  }
  
  const Top: FC<{ messages: string[] }> = (props: { messages: string[] }) => {
    return (
      <Layout>
        <h1>Hello Hono!</h1>
        <ul>
          {props.messages.map((message) => {
            return <li>{message}!!</li>
          })}
        </ul>
      </Layout>
    )
  }
  
  app.get('/', (c) => {
    const messages = ['Good Morning', 'Good Evening', 'Good Night']
    return c.html(<Top messages={messages} />)
  })
//...

export default app // for Cloudflare Workers or Bun