import React, { useMemo } from 'react';
import { Helmet } from 'react-helmet';
import { graphql, useStaticQuery } from 'gatsby';

export interface SEOProps {
  title?: string;
  description?: string;
  lang?: string;
  meta?: [];
  keywords?: [];
}

export interface SEOQuery {
  site: {
    siteMetadata: SiteMetadata;
  };
}

export interface SiteMetadata {
  title: string;
  description: string;
  author: string;
}

export function SEO({
  title,
  description,
  lang = 'en',
  meta = [],
  keywords = []
}: SEOProps) {
  const { siteMetadata } = useStaticQuery<SEOQuery>(detailsQuery).site;

  const defaultTitle = siteMetadata.title;
  const metaDescription = description || siteMetadata.description;
  const { mergedMeta, htmlAttributes } = useMemo(() => {
    const htmlAttributes = { lang };
    const mergedMeta = [
      {
        content: metaDescription,
        name: 'description'
      },
      {
        content: defaultTitle,
        property: `og:title`
      },
      {
        content: metaDescription,
        property: `og:description`
      },
      {
        content: `website`,
        property: `og:type`
      },
      {
        content: `summary`,
        name: `twitter:card`
      },
      {
        content: siteMetadata.author,
        name: `twitter:creator`
      },
      {
        content: defaultTitle,
        name: `twitter:title`
      },
      {
        content: metaDescription,
        name: `twitter:description`
      },
      {
        content: keywords.join(`, `),
        name: `keywords`
      },
      ...meta
    ];
    return { mergedMeta, htmlAttributes };
  }, [
    defaultTitle,
    metaDescription,
    siteMetadata.author,
    keywords,
    meta,
    lang
  ]);

  return (
    <Helmet
      htmlAttributes={htmlAttributes}
      title={defaultTitle}
      titleTemplate={title ? `%s | ${title}` : `%s`}
      meta={mergedMeta}
    />
  );
}

const detailsQuery = graphql`
  query DefaultSEOQuery {
    site {
      siteMetadata {
        title
        description
        author
      }
    }
  }
`;
