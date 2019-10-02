import { useState, useEffect } from 'react';

const USER_NAME = 'USER_NAME';

export function useUsername() {
  const [username, setUsername] = useState(
    sessionStorage.getItem(USER_NAME) || ''
  );

  useEffect(() => sessionStorage.setItem(USER_NAME, username), [username]);

  return { username, setUsername };
}
