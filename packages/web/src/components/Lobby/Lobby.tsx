import React, { useCallback } from 'react';
import { useRxAsync } from 'use-rx-hooks';
import { GameMeta } from '@/typings';
import { getMatches } from '@/services';
import { useMatches } from './MatchesProvider';
import { LobbyHeader } from './LobbyHeader';
import { LobbyItem } from './LobbyItem';

interface Props {
  meta: GameMeta;
}

export function Lobby({ meta }: Props) {
  const { name } = meta;
  const [state, actions] = useMatches();
  const request = useCallback(
    () => getMatches({ name }).then(res => res.data.matches),
    [name]
  );

  useRxAsync(request, {
    onSuccess: actions.list
  });

  return (
    <div className="lobby">
      <LobbyHeader meta={meta} />
      <div className="lobby-content">
        {state.ids.map(matchID => (
          <LobbyItem key={matchID} name={name} matchID={matchID} />
        ))}
      </div>
    </div>
  );
}
