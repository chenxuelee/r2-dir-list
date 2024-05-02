import { Props } from "hono/dist/types/jsx/base";
import { FC } from "hono/jsx";

import { createContext, useContext } from "hono/jsx";

import { memo } from "hono/jsx";

const Head: FC = (props: Props) => {
    return <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link href="https://cdn.jsdelivr.net/npm/daisyui@4.10.2/dist/full.min.css" rel="stylesheet" type="text/css" />
        <script src="https://cdn.tailwindcss.com"></script>
        {props.children}
    </head>;
};



const Footer: FC = memo(
    () => {

        return <footer className="flex justify-center text-xl my-2">
        <p> Powered by Cloudflare.</p>
        </footer>

    }

)





const NotFound:FC  = memo(() => {
    return (<html lang="en-US">
  <Head>
  </Head>
  <body>
  
      <div className="flex flex-col items-center justify-center h-screen">
        {/* <ExclamationCircleIcon className="text-red-600 h-24 w-24 mb-4" /> */}
        <h1 className="text-4xl font-bold text-gray-800">404 - Not Found</h1>
        <p className="text-gray-600 mt-4 mb-40">The page you are looking for does not exist.</p>
      </div>
  </body>
  </html>
    )
  } 
)


export {Head, Footer, NotFound}