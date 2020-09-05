import React, { useEffect, useRef } from 'react';
import { Link, generatePath } from 'react-router-dom';
import { ButtonGroup } from '@blueprintjs/core';
import { Subject } from 'rxjs';
import { throttleTime } from 'rxjs/operators';
import { ButtonPopover } from '../../components/ButtonPopover';
import { CreateMatch } from './CreateMatch';
import { PATHS } from '../../constants';

interface Props {
  name: string;
  onRefresh: () => void;
}

function useThrottle<T extends (...args: any[]) => void>(
  callback: T,
  debounce: number
) {
  const ref = useRef(new Subject());
  useEffect(() => {
    const subscription = ref.current
      .pipe(throttleTime(debounce))
      .subscribe(callback);
    return () => subscription.unsubscribe();
  }, [debounce, callback]);
  return ((payload: unknown) => ref.current.next(payload)) as T;
}

export function MatchesHeader({ name, onRefresh }: Props) {
  const handleRefresh = useThrottle(onRefresh, 1000);

  return (
    <div className="matches-header">
      <Link to={generatePath(PATHS.HOME, {})}>
        <ButtonPopover minimal content="Leave" icon="arrow-left" />
      </Link>
      <div className="header-title" />
      <ButtonGroup>
        <CreateMatch name={name} />
        <ButtonPopover
          minimal
          icon="refresh"
          content="Refresh"
          onClick={handleRefresh}
        />
      </ButtonGroup>
    </div>
  );
}
