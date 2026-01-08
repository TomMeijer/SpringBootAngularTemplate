/// <reference types="cypress" />

export {};

declare global {
  namespace Cypress {
    interface Chainable {
      visitAsLoggedIn(path?: string): Chainable<void>;
    }
  }
}

Cypress.Commands.add('visitAsLoggedIn', (path: string = '/') => {
  cy.intercept('GET', '/user', { fixture: 'user.json' }).as('getUser');
  cy.visit(path, {
    onBeforeLoad(win) {
      win.localStorage.setItem('tm-access-token', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJ0bSIsImlhdCI6MTc2Nzg0OTYzNSwiZXhwIjoxOTg4Nzc0NDM4LCJhdWQiOiJ0ZXN0Iiwic3ViIjoidGVzdEBjeXByZXNzLmNvbSJ9.H1CV1bpGq6bbwVvWuFXzFlZqf2ySF8hr1JX_fUKAKy0');
    },
  });
});
