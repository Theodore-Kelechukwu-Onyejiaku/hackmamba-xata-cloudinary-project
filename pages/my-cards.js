import { useEffect, useState } from 'react';
import { getToken } from 'next-auth/jwt';
import Link from 'next/link';
import Cards from '../components/Cards';
import SkeletonLoader from '../components/SkeletonLoader';
import { getXataClient } from '../utils/xata';
import ErrorComponent from '../components/ErrorComponent';

export default function MyCards({ data, error }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  if (loading) {
    return <SkeletonLoader />;
  }

  if (error) {
    return <ErrorComponent />;
  }

  return (
    <div className="dark:text-gray-300 dark:bg-black">
      <div className="mx-5">
        <h1 className="my-5 text-lg">Here are your cards</h1>

        {data?.length ? <Cards cards={data} edit /> : (
          <div className="flex flex-col h-screen justify-center items-center text-center my-5">
            <p>Sorry you have no cards at the moment!</p>
            <Link href="/create"><span className="text-red-500 underline cursor-pointer">Click here to create a card</span></Link>
          </div>
        )}
      </div>
    </div>
  );
}

export const getServerSideProps = async ({ req }) => {
  const token = await getToken({ req });
  if (!token) {
    return {
      props: {
        error: 'You are not signed in', data: null,
      },
    };
  }
  try {
    const xata = getXataClient();
    const cards = await xata.db.Cards.filter('user.id', token.user.id)
      .select(['*', 'user.*'])
      .getAll();

    return {
      props: { error: null, data: cards },
    };
  } catch (error) {
    return { props: { error: error.message, data: null } };
  }
};
