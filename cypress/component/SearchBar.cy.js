import SearchBar from '@/components/SearchBar';

describe('<SearchBar />', () => {
  it('Basic render', () => {
    cy.mount(<SearchBar />);

    // The search bar should be visible and have a placeholder
    cy.get('input').should('be.visible');
    cy.get('input').should('have.attr', 'placeholder', 'Suchen ...');
  });

  it('searchValue prop from parent sets value', () => {
    cy.mount(<SearchBar searchValue="Test" />);
    cy.get('input').should('have.value', 'Test');
  });

  it('Back link works', () => {
    cy.mount(<SearchBar backLink="https://www.example.com" />);

    // The back link should be visible and have the correct href
    cy.get('a').should('be.visible');
    cy.get('a').should('have.attr', 'href', 'https://www.example.com');
  });

  it('Filters work', () => {
    cy.mount(
      <SearchBar
        filters={[
          {
            filerValue: 'student',
            setFilterValue: () => {},
            filterOptions: [
              { value: '', label: 'Alle Typen' },
              { value: 'student', label: 'Schüler' },
              { value: 'staff', label: 'Mitarbeiter' },
              { value: 'other', label: 'Sonstige' },
            ],
          },
        ]}
      />
    );

    // The filter should be visible and have the correct value
    cy.get('#filter-button').should('be.visible');

    // When clicked the filter options should be visible
    cy.get('#filter-button').click();
    cy.get('select').should('be.visible');
    
    // It should have the correct options
    cy.get('select').children().should('have.length', 4);
    cy.get('select').should('contain', 'Alle Typen');
  });
});
