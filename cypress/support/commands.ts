/// <reference types="cypress" />

// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

declare global {
  namespace Cypress {
    interface Chainable {
      login(username: string, password: string): Chainable<void>;
      logout(): Chainable<void>;
    }
  }
}

Cypress.Commands.add('login', (username: string, password: string) => {
  cy.visit('/auth/login');
  cy.get('input[id="username"]').type(username);
  cy.get('input[id="password"]').type(password);
  cy.get('button[type="submit"]').should('be.enabled').click();
  cy.url().should('include', '/dashboard', { timeout: 10000 });
  cy.get('h1').should('contain', 'Panel de Control');
});

Cypress.Commands.add('logout', () => {
  cy.get('.btn-logout').click();
  cy.url().should('include', '/auth/login');
});

export {};
