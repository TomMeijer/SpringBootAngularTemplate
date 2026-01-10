context('Register', () => {
  beforeEach(() => {
    cy.visit('/register')
  })

  it('can register a new user', () => {
    cy.intercept('POST', '**/user', { fixture: 'auth.json' }).as('registerUser');

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
  })

  it('shows error when passwords do not match', () => {
    cy.get('[name=password] input').type('Password123!')
    cy.get('input[name=repeatPassword]').type('Password456!')

    cy.get('button[type=submit]').click()
    cy.get('.invalid-feedback').should('be.visible').and('contain', 'Repeated password does not match')
  })
})
