describe('Home Page', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000');
  });

  it('betöltődik az oldal és megjelenik a hero szekció', () => {
    cy.contains('Előadók').should('be.visible');
  });

  it('keresési funkció működik: beírunk egy keresési kifejezést, és az URL frissül', () => {
    // Keressük meg a keresőmezőt, majd gépeljük be a "Szabo" szót
    cy.get('input[label="Keresés"]').type('Szabo');
    // Ellenőrizzük, hogy az URL-ben szerepel a keresési paraméter
    cy.url().should('include', 'search=Szabo');
  });

  it('lapozás működik: a Pagination komponens frissíti az oldalszámot', () => {
    // Kattintsunk a "2" gombra a Pagination komponensben
    cy.get('.MuiPagination-root').contains('2').click();
    // Ellenőrizzük, hogy az URL frissült a page paraméterrel
    cy.url().should('include', 'page=2');
  });
});
