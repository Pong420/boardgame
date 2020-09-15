import React, { ReactElement, Children } from 'react';
import Link, { LinkProps } from 'next/link';
import { useRouter } from 'next/router';

interface Props extends LinkProps {
  activeClassName?: string;
  children: ReactElement;
}

export function NavLink({ children, activeClassName, ...props }: Props) {
  const { asPath } = useRouter();
  const child = Children.only(children);
  const childClassName = child.props.className || '';

  const className =
    asPath === props.href || asPath === props.as
      ? `${childClassName} ${activeClassName}`.trim()
      : childClassName;

  return (
    <Link {...props}>
      {React.cloneElement(child, {
        className: className || null
      })}
    </Link>
  );
}
