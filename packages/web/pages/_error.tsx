import React from 'react';
import { NextPage } from 'next';
import { Error as ErrorContent } from '@/components/Error';

interface Props {
  statusCode?: number;
}

const Error: NextPage<Props> = ({ statusCode }) => {
  return (
    <ErrorContent
      message={
        statusCode
          ? `An error ${statusCode} occurred on server`
          : 'An error occurred on client'
      }
    />
  );
};

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error;
