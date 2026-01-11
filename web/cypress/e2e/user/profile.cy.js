context('Profile', () => {
  beforeEach(() => {
    cy.visitAsLoggedIn('/')
    cy.wait('@getUser')

    // Open the profile modal
    cy.get('[data-cy=profile-dropdown]').click()
    cy.get('[data-cy=profile-link]').click()
  })

  it('can view profile information', () => {
    cy.get('[data-cy=first-name-input] input').should('have.value', 'Test')
    cy.get('[data-cy=last-name-input] input').should('have.value', 'User')
    cy.get('[data-cy=email-input] input').should('have.value', 'test@cypress.com')
    cy.get('[data-cy=email-input] input').should('have.attr', 'readonly')
  })

  it('can update profile information', () => {
    cy.intercept('PUT', '/user', { statusCode: 200 }).as('updateUser')
    cy.intercept('GET', '/user', { fixture: 'user.json' }).as('getUserUpdated')

    cy.get('[data-cy=first-name-input] input').clear().type('UpdatedFirst')
    cy.get('[data-cy=last-name-input] input').clear().type('UpdatedLast')

    cy.get('[data-cy=save-button] button').click()

    cy.wait('@updateUser').its('request.body').should((body) => {
      // The request is sent as FormData
      expect(body).to.contain('UpdatedFirst')
      expect(body).to.contain('UpdatedLast')
    })

    // The modal should close after successful update
    cy.get('.modal-content').should('not.exist')
  })

  it('can delete the user account', () => {
    cy.intercept('DELETE', '/user', { statusCode: 200 }).as('deleteUser')

    cy.get('[data-cy=delete-account-button] button').click()

    // Confirmation popover should be visible
    cy.get('[data-cy=confirm-delete-button]').should('be.visible')
    cy.get('[data-cy=cancel-delete-button]').should('be.visible')

    // Click confirm
    cy.get('[data-cy=confirm-delete-button]').click()

    cy.wait('@deleteUser')

    // Verify redirection to login page and tokens removed (similar to logout)
    cy.url().should('include', '/login')
    cy.window().then((win) => {
      expect(win.localStorage.getItem('tm-access-token')).to.be.null
      expect(win.localStorage.getItem('tm-refresh-token')).to.be.null
    })
  })
})
