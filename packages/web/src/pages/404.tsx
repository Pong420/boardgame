import { navigate } from 'gatsby';

export default function () {
  typeof window !== 'undefined' && navigate('/');
  return null;
}
