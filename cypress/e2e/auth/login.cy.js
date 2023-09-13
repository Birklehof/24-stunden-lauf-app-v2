// describe('Login with Microsoft', () => {
//   it('Basic login', () => {
//     cy.loginToAAD(Cypress.env('aad_username'), Cypress.env('aad_password'));
//   });
// });

describe('Log in as assistant with code', () => {
  it('GET /api/auth/staff returns 405', function () {
    cy.request({
      method: 'GET',
      url: 'http://localhost:3000/api/auth/staff',
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(405);
    });
  });

  it('POST /api/auth/staff returns 400 when not provided with code', function () {
    cy.request({
      method: 'POST',
      url: 'http://localhost:3000/api/auth/staff',
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(400);
    });
  });

  it('POST /api/auth/staff returns 401 when provided with invalid code', function () {
    cy.request({
      method: 'POST',
      url: 'http://localhost:3000/api/auth/staff',
      failOnStatusCode: false,
      body: {
        code: 'invalid_code', // Always invalid because a code should consist of 6 digits
      },
    }).then((response) => {
      expect(response.status).to.eq(401);
    });
  });
});
