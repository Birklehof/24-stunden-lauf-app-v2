describe('Login', () => {
  it('Shows Login', function () {
    cy.visit('http://localhost:3000/');

    // UI should have two login buttons
    cy.contains('Läufer').should('be.visible');
    cy.contains('Helfer').should('be.visible');
  });
});
