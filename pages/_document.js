// import { Html, Head, Main, NextScript } from 'next/document'

// export default function Document() {
//     return (
//         <Html>
//             <Head>
//                 <script src="https://upload-widget.cloudinary.com/global/all.js" type="text/javascript">
//                 </script>
//             </Head>
//             <body>
//                 <Main />
//                 <NextScript />
//             </body>
//         </Html>
//     )
// }

import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
    static async getInitialProps(ctx) {
        const initialProps = await Document.getInitialProps(ctx);
        return { ...initialProps };
    }

    render() {
        return (
            <Html>
                <Head>
                    <link
                        href="https://fonts.googleapis.com/css2?family=Source+Sans+Pro:wght@300&display=swap"
                        rel="stylesheet"
                    />
                    <link
                        href="https://fonts.googleapis.com/css2?family=Mulish:wght@800&display=swap"
                        rel="stylesheet"
                    ></link>
                    <link
                        href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300&display=swap"
                        rel="stylesheet"
                    ></link>

                    <script
                        defer
                        src="https://widget.cloudinary.com/v2.0/global/all.js"
                        type="text/javascript"
                    ></script>
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}

export default MyDocument;