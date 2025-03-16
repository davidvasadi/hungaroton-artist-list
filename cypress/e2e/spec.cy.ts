// cypress/e2e/home_page.cy.ts
describe('Home Page', () => {
  it('betöltődik az oldal', () => {
    cy.visit('http://localhost:3000');
    
    cy.contains('Fedezd fel az előadókat!').should('be.visible');
  });
});
