import Icon from '@/components/Icon';

describe('<Icon />', () => {
  it('Basic render', () => {
    cy.mount(<Icon />);

    // The svg should be visible
    cy.get('svg').should('be.visible');

    // The svg should be 20 by 20 pixels
    cy.get('svg').invoke('width').should('equal', 20);
    cy.get('svg').invoke('height').should('equal', 20);
  });
});
