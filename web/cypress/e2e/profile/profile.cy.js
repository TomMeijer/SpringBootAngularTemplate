context('Profile', () => {
  beforeEach(() => {
    cy.visitAsLoggedIn('/')
  })

  it('can display the current user\'s profile information', () => {
    cy.wait('@getUser')
    cy.get('[data-cy=profile-dropdown]').click()
    cy.get('[data-cy=profile-link]').click()
    cy.get('[name=firstName] input').should('contain.value', 'Test')
    cy.get('[name=lastName] input').should('contain.value', 'User')
    cy.get('[name=email] input').should('contain.value', 'test@cypress.com')
  })

  it('can update the current user\'s profile information', () => {
    cy.wait('@getUser')
    cy.get('[data-cy=profile-dropdown]').click()
    cy.get('[data-cy=profile-link]').click()
    cy.get('[name=firstName] input').clear().type('Hulk')
    cy.get('[name=lastName] input').clear().type('Hogan')
    cy.intercept('PUT', '/user', {}).as('updateUser');
    cy.get('[data-cy=profile-save-btn] button').click()
    cy.wait('@updateUser').then(interceptor => {
      const body = interceptor.request.body;
      expect(body).to.contain('name="firstName"');
      expect(body).to.contain('\r\n\r\nHulk\r\n');
      expect(body).to.contain('name="lastName"');
      expect(body).to.contain('\r\n\r\nHogan\r\n');
    })
  })

  it('can delete the current user\'s account', () => {
    cy.wait('@getUser')
    cy.get('[data-cy=profile-dropdown]').click()
    cy.get('[data-cy=profile-link]').click()

    cy.intercept('DELETE', '/user', { statusCode: 204 }).as('deleteUser')

    cy.contains('button', 'Delete account').click()
    cy.get('.popover').should('be.visible')
    cy.contains('button', 'Confirm').click()

    cy.wait('@deleteUser')
    cy.url().should('include', '/login')
  })
})
