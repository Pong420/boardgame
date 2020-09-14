import Router from 'koa-router';
import { LobbyAPI } from 'boardgame.io';
import { MetadataModel, getListGamesOptsQuery } from 'bgio-mongo';

export function overrideGetMatches(router: Router) {
  const targetPath = '/games/:name';

  router.stack = router.stack.filter(stack => stack.path !== targetPath);

  router.get(targetPath, async ctx => {
    const gameName = ctx.params.name;
    const {
      isGameover: isGameoverString,
      updatedBefore: updatedBeforeString,
      updatedAfter: updatedAfterString
    } = ctx.query;

    let isGameover: boolean | undefined;
    if (isGameoverString) {
      if (isGameoverString.toLowerCase() === 'true') {
        isGameover = true;
      } else if (isGameoverString.toLowerCase() === 'false') {
        isGameover = false;
      }
    }
    let updatedBefore: number | undefined;
    if (updatedBeforeString) {
      const parsedNumber = Number.parseInt(updatedBeforeString, 10);
      if (parsedNumber > 0) {
        updatedBefore = parsedNumber;
      }
    }
    let updatedAfter: number | undefined;
    if (updatedAfterString) {
      const parsedNumber = Number.parseInt(updatedAfterString, 10);
      if (parsedNumber > 0) {
        updatedAfter = parsedNumber;
      }
    }

    const _matches = await MetadataModel.find({
      unlisted: false,
      ...getListGamesOptsQuery({
        gameName,
        where: { isGameover, updatedAfter, updatedBefore }
      })
    });

    const body: LobbyAPI.MatchList = {
      matches: _matches.map<LobbyAPI.Match>(metadata => {
        metadata = metadata.toJSON();
        return {
          ...metadata,
          players: Object.values(metadata.players).map(player => {
            // strip away credentials
            const { credentials, ...strippedInfo } = player;
            return strippedInfo;
          })
        };
      })
    };
    ctx.body = body;
  });
}
