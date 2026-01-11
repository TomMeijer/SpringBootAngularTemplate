context('Register', () => {
  beforeEach(() => {
    cy.clearLocalStorage()
    cy.window().then((win) => {
      win.sessionStorage.clear()
    })
    cy.visit('/register')
  })

  it('can register a new user', () => {
    cy.intercept('POST', '**/user', { fixture: 'auth.json' }).as('registerUser');
    cy.intercept('GET', '**/user', { fixture: 'user.json' }).as('getUser');

    cy.get('[name=firstName] input').type('John')
    cy.get('[name=lastName] input').type('Doe')
    cy.get('[name=email] input').type('john.doe@example.com')
    cy.get('[name=password] input').type('Password123!')
    cy.get('input[name=repeatPassword]').type('Password123!')
    cy.get('button[type=submit]').click()

    cy.wait('@registerUser').then(interceptor => {
      expect(interceptor.request.body).to.deep.equal({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'Password123!'
      })
    })
    cy.url().should('include', '/home')
    cy.fixture('auth.json').then((auth) => {
      cy.window().then((win) => {
        expect(win.localStorage.getItem('tm-access-token')).to.equal(auth.accessToken)
        expect(win.localStorage.getItem('tm-refresh-token')).to.equal(auth.refreshToken)
      })
    })
  })

  it('shows error when passwords do not match', () => {
    cy.get('[name=password] input').type('Password123!')
    cy.get('input[name=repeatPassword]').type('Password456!')
    cy.get('button[type=submit]').click()
    cy.get('.invalid-feedback').should('be.visible').and('contain', 'Repeated password does not match')
  })
})
