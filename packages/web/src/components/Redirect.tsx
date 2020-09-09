import { navigate } from 'gatsby';

interface Props {
  to?: string;
}

export function Redirect({ to = '/' }: Props) {
  if (typeof window !== 'undefined') {
    navigate('/');
  }
  return null;
}
