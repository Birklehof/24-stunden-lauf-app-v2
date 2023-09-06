describe('Login with Microsoft', () => {
  it('Basic login', () => {
    cy.loginToAAD(Cypress.env('aad_username'), Cypress.env('aad_password'));
  });
});
