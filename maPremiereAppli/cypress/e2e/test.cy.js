//maPremiereAppli/cypress/e2e/spec.cy.js
describe('template spec', () => {
    it('passes', () => {
        cy.visit('http://localhost:5000');
        cy.get('#emailInput').clear().type('Sebastien.Viardot@grenoble-inp.fr');
        cy.get('#connect').click();
        cy.contains('C\'est mon bonjour n° 0');
        cy.contains('Re Bonjour?').click();
        cy.contains('C\'est mon bonjour n° 1');
        cy.contains('Re Bonjour?').click();
        cy.contains('C\'est mon bonjour n° 2');
        cy.contains('Nouveau jour').click();
        cy.contains('C\'est mon bonjour n° 0');
        cy.get('#disconnect').click();
        cy.contains('Se connecter');
    });
});