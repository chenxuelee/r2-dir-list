// @ts-nocheck
import { Hono } from "hono";
import { logger } from "hono/logger"
import type { FC } from "hono/jsx"

import { R2Bucket, R2ListOptions, R2Objects, R2Object } from "@cloudflare/workers-types"

import { memo } from "hono/jsx";
import { Props } from "hono/dist/types/jsx/base";
import { jsxRenderer, useRequestContext } from 'hono/jsx-renderer'
import { css, cx, keyframes, Style } from 'hono/css'

import { cssStyles } from "./static";



const app = new Hono()


var cleanTitle = (path: string) => {
  var parts = path.split("/")
  // remove the empty strings
  parts = parts.filter((part) => part !== "")
  return parts[parts.length - 1]
}



var cleanFileName = (name: string) => {
  return name.split("/").slice(-1).pop()!
}

var cleanFolderName = (name: string) => {
  return name.slice(0, -1).split("/").slice(-1).pop()!
}

// taken from https://stackoverflow.com/questions/10420352/converting-file-size-in-bytes-to-human-readable-string
var humanFileSize = (bytes: number, si = false, dp = 1) => {
  const thresh = si ? 1000 : 1024;

  if (Math.abs(bytes) < thresh) {
    return bytes + ' B';
  }

  const units = si
    ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
    : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
  let u = -1;
  const r = 10 ** dp;

  do {
    bytes /= thresh;
    ++u;
  } while (Math.round(Math.abs(bytes) * r) / r >= thresh && u < units.length - 1);


  return bytes.toFixed(dp) + ' ' + units[u];
}




const Head:FC  = (props: Props) => {


  return <head>

    <meta charSet="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />


    <link href="https://cdn.jsdelivr.net/npm/daisyui@4.10.2/dist/full.min.css" rel="stylesheet" type="text/css" />
    <script src="https://cdn.tailwindcss.com"></script>
    <style> 
      {props.cssstring}
    </style>

    {props.children}

  </head>



}



const Body:FC  = (props: Props) => {
  return <body className="md:mx-5 mt-5 flex flex-col items-start	 gap-2  min-h-full">

    
{props.children}
  </body>
}




const Html:FC = (props: Props) => {

return <html lang="en-US">
{props.children}
</html>

}





const Footer:FC = (props: Props) => {
  return <footer className="bg-gray-800 text-white p-5 text-center ">
    <p>© 2022 Cloudflare, Inc. All rights reserved.</p>
  </footer>
}

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



app.get("/", (c) => {

return c.html(
<Html>
<Head cssstring={cssStyles}>


</Head>

<Body>



<nav class="breadcrumbs text-lg">
  <ul>
    <li className="text-2xl"><a href="#">Home</a></li>
    <li><a href="#">About Us</a></li>
    <li><a href="#">Products</a></li>
    <li><a href="#">Product Details</a></li>
  </ul>
</nav>


<div className=" w-full min-h-96">

</div>


<div className="w-full  flex flex-1 justify-end flex-col mb-8">
<Footer />
</div>

</Body>


</Html>


)

})







export default app