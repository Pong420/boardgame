import React from 'react';
import Head from 'next/head';
import { GetServerSideProps } from 'next';
import { Error } from '@/components/Error/Error';

type Params = {
  message: string;
};

interface Props extends Params {}

export default function ErrorPage({ message }: Props) {
  return (
    <>
      <Head>
        <title>Boardgame | Error</title>
      </Head>
      <Error message={message} />
    </>
  );
}

export const getServerSideProps: GetServerSideProps<Props, Params> = async ({
  params
}) => {
  return {
    props: {
      ...params
    }
  };
};
