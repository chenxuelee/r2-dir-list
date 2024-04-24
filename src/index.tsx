import { Hono } from "hono";
import { logger } from "hono/logger"
import type { FC } from "hono/jsx"

import { R2Bucket, R2ListOptions, R2Objects, R2Object } from "@cloudflare/workers-types"

import { memo } from "hono/jsx";

import { cssStyles } from "./static";

import { clientJs } from "./static";


const app = new Hono()

const Head: FC = (props) => {
  return <head>
    <meta charSet="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta httpEquiv="X-UA-Compatible" content="ie=edge" />
    {/* <script src="/client.js"></script> */}
  <link href="https://cdn.jsdelivr.net/npm/daisyui@4.10.2/dist/full.min.css" rel="stylesheet" type="text/css" />
  <script src="https://cdn.tailwindcss.com"></script>

  {/* <link rel="stylesheet" type="text/css" href="/css/styles.css"></link> */}
    {/* <title>R2-Dir-List</title> */}
  </head>
}





var cleanTitle = (path: string) => {
  var parts = path.split("/")
  // remove the empty strings
  parts = parts.filter((part) => part !== "")
  return parts[parts.length-1]
}



var cleanFileName = (name: string) => {
  return name.split("/").slice(-1).pop()!
}

var cleanFolderName = (name: string) => {
  return name.slice(0, -1).split("/").slice(-1).pop()!
}

// taken from https://stackoverflow.com/questions/10420352/converting-file-size-in-bytes-to-human-readable-string
var humanFileSize = (bytes: number, si=false, dp=1) => {
const thresh = si ? 1000 : 1024;

if (Math.abs(bytes) < thresh) {
  return bytes + ' B';
}

const units = si 
  ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'] 
  : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
let u = -1;
const r = 10**dp;

do {
  bytes /= thresh;
  ++u;
} while (Math.round(Math.abs(bytes) * r) / r >= thresh && u < units.length - 1);


return bytes.toFixed(dp) + ' ' + units[u];
}








const Outline: FC = (props) => {


  
  return <html>
    <Head>
      <title>{props.title}</title>
    </Head>
    <body>
    <h1>{props.title}</h1>
    <p>This is a simple directory listing tool for R2-D2.</p>
    <p>It is built with Hono, a lightweight web framework for Deno.</p>
    <p>You can find the source code on <a href="https://github.com/yantaowang/r2-dir-list">GitHub</a>.</p>
    <p>Enjoy!</p>
    </body>

  </html>
}





const Datatable: FC = (props) => {
  const files = props.files
  const dirs = props.dirs
  return <table>  
    <thead> </thead>

    <tbody>
      {files.map((file) => (
        <tr key={file.name}>  </tr>

      ))}
      {dirs.map((dir) => (
        <tr key={dir.name}>  </tr>

      ))}
    </tbody>
  </table>
}




app.use(logger())



// app.use(async (c, next) => {
//   console.log(JSON.stringify(c.req.url, null, 2))
//   console.log(JSON.stringify(c.req.path, null, 2))
//   await next()
// })


async function listBucket(bucket: R2Bucket, options?: R2ListOptions): Promise<R2Objects> {
  // List all objects in the bucket, launch new request if list is truncated
  const objects: R2Object[] = [];
  const delimitedPrefixes: string[] = [];

  // delete limit, cursor in passed options
  const requestOptions = {
      ...options,
      limit: undefined,
      cursor: undefined,
  };

  var cursor = undefined;
  while (true) {
      const index = await bucket.list({
          ...requestOptions,
          cursor,
      });
      objects.push(...index.objects);
      delimitedPrefixes.push(...index.delimitedPrefixes);
      if (!index.truncated) {
          break;
      }
      cursor = index.cursor;
  }
  return {
      objects,
      delimitedPrefixes,
      truncated: false
  };
}





app.get('/', (c) => {
  return c.html(<Outline title="R2-Dir-List"  />)
})



export default app