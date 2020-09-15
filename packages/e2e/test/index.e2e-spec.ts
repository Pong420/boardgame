describe('Basic', () => {
  it.skip('should be titled correctly', async () => {
    await expect(page).goto('/');
    await expect(page.title()).resolves.toMatch('Boardgame');
  });
});
