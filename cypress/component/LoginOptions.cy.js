import LoginOptions from '@/components/LoginOptions';

describe('<LoginOptions />', () => {
  it('Basic render', () => {
    cy.mount(<LoginOptions />);

    // Two login buttons should be visible
    cy.contains('Läufer').should('be.visible');
    cy.contains('Assistent').should('be.visible');

    //The debug login button should not be visible
    cy.contains('Cypress e2e Login').should('not.be.visible');
  });
});
