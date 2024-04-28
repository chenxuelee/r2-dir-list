// @ts-nocheck

import { Hono, Context } from 'hono'

import { logger } from "hono/logger"
import type { FC } from "hono/jsx"

import { R2Bucket, R2ListOptions, R2Objects, R2Object } from "@cloudflare/workers-types"


import { memo } from "hono/jsx";
import { Props } from "hono/dist/types/jsx/base";
import { jsxRenderer, useRequestContext } from 'hono/jsx-renderer'
import { css, cx, keyframes, Style } from 'hono/css'

import { cssStyles } from "./static";

// import { ExclamationCircleIcon } from "@heroicons/react/24/outline"




// import { URL } from '@cloudflare/workers-types';



const app = new Hono()

app.use("*", logger())













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




// async function getdirs(path:string) {

//   return 0;
// }


const Head: FC = (props: Props) => {


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



const Body: FC = (props: Props) => {
  return <body className="md:mx-5 mt-5 flex flex-col items-start	 gap-2  min-h-full">


    {props.children}
  </body>
}




const Html: FC = (props: Props) => {

  return <html lang="en-US">
    {props.children}
  </html>

}




const NotFound:FC  = () => {
  return (<Html>
<Head>
</Head>
<body>

    <div className="flex flex-col items-center justify-center h-screen">
      {/* <ExclamationCircleIcon className="text-red-600 h-24 w-24 mb-4" /> */}
      <h1 className="text-4xl font-bold text-gray-800">404 - Not Found</h1>
      <p className="text-gray-600 mt-4 mb-40">The page you are looking for does not exist.</p>
    </div>
</body>
</Html>
  )
}




const Footer: FC = (props: Props) => {
  return <footer className="bg-gray-800 text-white p-5 text-center ">
    <p>Powered by Cloudflare Workers, Daisyui CSS Framework, and Tailwind CSS</p>
  </footer>
}

async function listBucket(bucket: R2Bucket, options?: R2ListOptions): Promise<R2Objects> {
  // List all objects in the bucket, launch new request if list is truncated
  var objects: R2Object[] = [];
  var delimitedPrefixes: string[] = [];

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




app.notFound((c) => {
  c.status(404)
  return c.html(<NotFound />)
}
)

// const Datatable: FC = async (props) => {

//     const inputurl = "https://lib.yantaowang.com/"

//     const url = new URL(inputurl)

//     const hostname = url.hostname

//     const pathname =url.pathname

//     const objectKey = path.slice(1);

//     const bucket =props.bucket 



//     const options: R2ListOptions = {
//       prefix: objectKey,
//       delimiter: '/',
//       include: ['httpMetadata', 'customMetadata']
//     }



//     const index = await listBucket(bucket, options);

//     return <>
//     </>

// }




// const Notfound: FC = () => {




// }







// app.get("/", (c) => {

//   return c.html(
//     <Html>
//       <Head cssstring={cssStyles}>


//       </Head>

//       <Body>



//         <nav class="breadcrumbs text-lg">
//           <ul>
//             <li className="text-2xl"><a href="#">Home</a></li>
//             <li><a href="#">About Us</a></li>
//             <li><a href="#">Products</a></li>
//             <li><a href="#">Product Details</a></li>
//           </ul>
//         </nav>


//         <div className=" w-full min-h-96">

//         </div>


//         <div className="w-full  flex flex-1 justify-end flex-col mb-8">
//           <Footer />
//         </div>

//       </Body>


//     </Html>


//   )

// })


app.get("*", async (c: Context) => {

  const req = c.req; 
  const url = new URL(req.url);

  const domain = url.hostname;
  const path = url.pathname;
  // remove the leading '/'
  const objectKey = path.slice(1);

  const bucket = c.env.BUCKET_monolibrary;
  console.log(objectKey)

  console.log(bucket)
  const index = await listBucket(bucket, {
    prefix: objectKey,
    delimiter: '/',
    include: ['httpMetadata', 'customMetadata']
});


console.log(index.delimitedPrefixes.length)

console.log(index.objects.length)

  // console.log(url)

  // console.log(domain)
  // console.log(path)
  // console.log(objectKey)







  return c.notFound()



}
)







export default app