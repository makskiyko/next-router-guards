import {NextRequest, NextResponse} from 'next/server';

import {Guard} from './guard.class';

export const combineGuards = (guards: Guard<any, any, any>[]): ((request: NextRequest) => Promise<NextResponse>) => {
  return async (request: NextRequest) => {
    const responses = await Promise.all(
      guards.map(async (guard) => {
        const response = await guard.resolveRequest(request);

        if (response) {
          return guard.sendResponseByCanAccess(request, response);
        }
      }),
    );

    const notEmptyResponse = responses.find((response) => !!response);

    return notEmptyResponse ?? NextResponse.next();
  };
};
