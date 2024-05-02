// @ts-nocheck

import { Hono, Context } from "hono";

import { logger } from "hono/logger";
import type { FC } from "hono/jsx";

import {
  R2Bucket,
  R2ListOptions,
  R2Objects,
  R2Object,
} from "@cloudflare/workers-types";
import { memo } from "hono/jsx";
import { Props } from "hono/dist/types/jsx/base";

import { createContext, useContext } from "hono/jsx";

import { Footer, Head, NotFound } from "./components";
import { cleanTitle } from "./render";

// import { jsxRenderer, useRequestContext } from 'hono/jsx-renderer'
// import { css, cx, keyframes, Style } from 'hono/css'

// import { cssStyles } from "./static";

// import { ExclamationCircleIcon } from "@heroicons/react/24/outline"

// import { URL } from '@cloudflare/workers-types';

const data = {
  files: [],
  dirs: [],
};

const Datacontext = createContext(data);

const Datatable: FC = () => {
  const datas = useContext(Datacontext);

  return <table></table>;
};

const app = new Hono();

app.use("*", logger());

const Html: FC = (props: Props) => {
  return <html lang="en-US">{props.children}</html>;
};

// const Footer: FC = (props: Props) => {
//   return <footer className="bg-gray-800 text-white p-5 text-center ">
//     <p>Powered by Cloudflare Workers, Daisyui CSS Framework, and Tailwind CSS</p>
//   </footer>
// }

async function listBucket(
  bucket: R2Bucket,
  options?: R2ListOptions
): Promise<R2Objects> {
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
    truncated: false,
  };
}

app.notFound((c) => {
  c.status(404);
  return c.html(<NotFound />);
});

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
  console.log(objectKey);

  console.log(bucket);
  const index = await listBucket(bucket, {
    prefix: objectKey,
    delimiter: "/",
    include: ["httpMetadata", "customMetadata"],
  });

  const Page: FC = () => {
    return (
      <html lang="zh-CN">
        <Head>
          <title>{cleanTitle(path)}</title>
          <body>
            <header>

            </header>

            <main className="flex ">


            </main>
            {/* <div>{index.delimitedPrefixes.map((m)=>
            {return <p>{m}</p>}
            )}</div> */}
            <Footer></Footer>
          </body>
        </Head>
      </html>
    );
  };

  return c.html(<Page></Page>);
});

app.get("*", async (c: Context) => {
  const req = c.req;
  const url = new URL(req.url);

  const domain = url.hostname;
  const path = url.pathname;
  // remove the leading '/'
  const objectKey = path.slice(1);

  const bucket = c.env.BUCKET_monolibrary;
  console.log(objectKey);

  console.log(bucket);
  const index = await listBucket(bucket, {
    prefix: objectKey,
    delimiter: "/",
    include: ["httpMetadata", "customMetadata"],
  });

  console.log(index.delimitedPrefixes.length);

  console.log(index.objects.length);

  // console.log(url)

  // console.log(domain)
  // console.log(path)
  // console.log(objectKey)

  return c.notFound();
});

export default app;
