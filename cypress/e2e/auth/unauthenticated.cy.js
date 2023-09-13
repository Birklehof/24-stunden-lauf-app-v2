describe('Frontend redirect for unauthenticated users', function () {
  it('/runner/index.tsx is redirected', check_frontend_path.bind(null, 'runner'));
  it('/runner/charts.tsx is redirected', check_frontend_path.bind(null, 'runner/charts'));

  it('/assistant/index.tsx is redirected', check_frontend_path.bind(null, 'assistant'));
  it(
    '/assistant/create-runner.tsx is redirected',
    check_frontend_path.bind(null, 'assistant/create-runner')
  );

  it('/shared/ranking.tsx is redirected', check_frontend_path.bind(null, 'ranking'));
});

describe('Backend handling of unauthenticated users', function () {
  it('GET /api/laps/create returns 405', function () {
    cy.request({
      method: 'GET',
      url: 'http://localhost:3000/api/laps/create',
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(405);
    });
  });

  it('POST /api/laps/create returns 401', function () {
    cy.request({
      method: 'POST',
      url: 'http://localhost:3000/api/laps/create',
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(401);
    });
  });
});

function check_frontend_path(path) {
  cy.visit('http://localhost:3000/' + path);

  cy.wait(100);

  // The user should be redirected to the login page
  cy.url().should('eq', 'http://localhost:3000/');
}
