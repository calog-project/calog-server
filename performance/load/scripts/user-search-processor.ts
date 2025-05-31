import { ActionFn, AfterResponseFn, BeforeScenarioFn } from 'artillery';

export const generateOffsetParams: ActionFn = (ctx, events, done) => {
  ctx.vars.keyword = 'test';
  const offsetNum = Number(ctx.vars.offset ?? 0);
  ctx.vars.offset = offsetNum + 20;
  done();
};

export const generateCursorParams: BeforeScenarioFn = (ctx, events, done) => {
  ctx.vars.keyword = 'test';
  done();
};

export const captureNextCursor: AfterResponseFn = (
  reqParam,
  res,
  ctx,
  ee,
  next,
) => {
  if (typeof res.body === 'string') {
    const body = JSON.parse(res.body);
    ctx.vars.cursor = body.payload.data.cursor;
  }
  next();
};
