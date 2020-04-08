const mockData = {
  1: 'This is new 1',
  2: 'This is new 1',
  3: 'This is new 1',
  4: 'This is new 1'
}

export const fetch = ctx => {
  return Promise.resolve({
    detail: mockData[ctx.req.query.id]
  })
}
