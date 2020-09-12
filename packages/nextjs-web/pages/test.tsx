import { NextPage } from 'next';
import { useEffect } from 'react';
import router from 'next/router'

interface Props {
  userAgent?: number;
}

const Page: NextPage<Props> = ({ userAgent }) => {

  useEffect(() => {
    window.addEventListener('click', () => {
      router.replace(window.location.pathname)
    })
  }, []);

  return <main>Your user agent: {userAgent}</main>;
};

Page.getInitialProps = async ({ req }) => {
  return { userAgent: Math.random() };
};

export default Page;
