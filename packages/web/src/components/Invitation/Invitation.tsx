import React, { ReactNode, useEffect } from 'react';
import { parse } from 'qs';
import { navigate } from 'gatsby';
import { useRxAsync } from 'use-rx-hooks';
import { gameMetaMap } from '@/games';
import { getMatch } from '@/services';
import { JoinMatch } from '../Lobby/JoinMatch';
import { Spectate } from '../Lobby/Spectate';

interface Props {
  search: string;
}

export function Invitation({ search }: Props) {
  const [{ data: match, loading }, { fetch }] = useRxAsync(getMatch, {
    defer: true
  });

  let content: ReactNode;

  useEffect(() => {
    const params = search
      ? (parse(search) as Record<string, string>)
      : undefined;
    if (params && params.matchID && params.name) {
      fetch({ name: params.name, matchID: params.matchID });
    } else {
      navigate('/');
    }
  }, [search, fetch]);

  if (match) {
    const meta = gameMetaMap[match.data.gameName];
    const { id: nextPlayerID } =
      match.data.players.find(p => typeof p.name === 'undefined') || {};

    if (nextPlayerID) {
      content = (
        <div>
          <div className="text">Let's play boardgame</div>
          <JoinMatch
            name={match.data.gameName}
            matchID={match.data.matchID}
            playerID={String(nextPlayerID)}
          />
        </div>
      );
    } else {
      content = (
        <div>
          <div className="text">The match already started</div>
          <Spectate
            name={match.data.gameName}
            matchID={match.data.matchID}
            players={match.data.players}
            allow={!!match.data.setupData?.spectate}
            type={meta.spectate}
          />
        </div>
      );
    }
  }

  if (loading) {
    content = <div className="text">loading...</div>;
  }

  return <div className="invitation">{content}</div>;
}
