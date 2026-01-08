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
})
