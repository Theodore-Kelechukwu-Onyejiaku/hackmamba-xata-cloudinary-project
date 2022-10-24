import Head from 'next/head'
// Generated with CLI
import { getXataClient } from "../utils/xata";

export default function Home() {
  return (
    <div >
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

    </div>
  )
}

export const getServerSideProps = async () => {

  const xata = getXataClient();

  const page = await xata.db.Users.getPaginated({
    pagination: {
      size: 15,
    },
  });

  console.log(page.records);
  return {
    props: {}
  }
}
