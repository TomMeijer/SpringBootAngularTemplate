context('Logout', () => {
  beforeEach(() => {
    cy.visitAsLoggedIn('/')
  })

  it('can log out successfully', () => {
    cy.wait('@getUser')

    // Click the profile dropdown
    cy.get('[data-cy=profile-dropdown]').click()

    // Click the Log out link
    cy.get('[data-cy=logout-link]').click()

    // Verify that tokens are removed from storage
    cy.window().then((win) => {
      expect(win.localStorage.getItem('tm-access-token')).to.be.null
      expect(win.localStorage.getItem('tm-refresh-token')).to.be.null
    })

    // Verify redirection to the login page
    cy.url().should('include', '/login')
  })
})
