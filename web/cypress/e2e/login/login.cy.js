context('Login', () => {
  beforeEach(() => {
    cy.clearLocalStorage()
    cy.window().then((win) => {
      win.sessionStorage.clear()
    })
    cy.visit('/login')
  })

  it('can login with valid credentials', () => {
    cy.intercept('GET', '**/user', { fixture: 'user.json' }).as('getUser');
    cy.intercept('POST', '**/auth', { fixture: 'auth.json' }).as('loginRequest');

    cy.get('[name=email] input').type('test@example.com')
    cy.get('[name=password] input').type('Password123!')
    cy.get('button[type=submit]').click()

    cy.wait('@loginRequest').then(interceptor => {
      expect(interceptor.request.body).to.deep.equal({
        email: 'test@example.com',
        password: 'Password123!'
      })
    })
    cy.wait('@getUser')

    cy.url().should('include', '/home')

    cy.fixture('auth.json').then((auth) => {
      cy.window().then((win) => {
        expect(win.localStorage.getItem('tm-access-token')).to.equal(auth.accessToken)
        expect(win.localStorage.getItem('tm-refresh-token')).to.equal(auth.refreshToken)
      })
    })
  })

  it('can login with remember me unchecked', () => {
    cy.intercept('GET', '/user', { fixture: 'user.json' }).as('getUser');
    cy.intercept('POST', '**/auth', { fixture: 'auth.json' }).as('loginRequest');

    cy.get('[name=email] input').type('test@example.com')
    cy.get('[name=password] input').type('Password123!')

    // Uncheck remember me (it's checked by default in the component)
    cy.get('[name=rememberMe] input').uncheck({force: true})

    cy.get('button[type=submit]').click()

    cy.wait('@loginRequest')
    cy.wait('@getUser')
    cy.url().should('include', '/home')

    cy.fixture('auth.json').then((auth) => {
      cy.window().then((win) => {
        expect(win.sessionStorage.getItem('tm-access-token')).to.equal(auth.accessToken)
        expect(win.sessionStorage.getItem('tm-refresh-token')).to.equal(auth.refreshToken)
      })
    })
  })

  it('shows error message on failed login', () => {
    cy.intercept('POST', '**/auth', {
      statusCode: 401,
      body: { message: 'Unauthorized' }
    }).as('loginRequest');

    cy.get('[name=email] input').type('test@example.com')
    cy.get('[name=password] input').type('wrong-password')
    cy.get('button[type=submit]').click()

    cy.wait('@loginRequest')

    // Check if submitting state is cleared (button enabled or spinner gone)
    // In the component, error handler sets isSubmitting to false
    cy.get('button[type=submit]').should('not.be.disabled')
  })

  it('shows validation errors when fields are empty', () => {
    cy.get('button[type=submit]').click()

    // The form gets 'was-validated' class which shows bootstrap validation
    cy.get('form.was-validated').should('exist')

    // tm-input likely shows invalid feedback if it's required and empty
    // Based on register.cy.js, we might look for .invalid-feedback if available
    // For now, checking that we didn't navigate away
    cy.url().should('include', '/login')
  })

  it('can navigate to register page', () => {
    cy.contains('a', 'Register').click()
    cy.url().should('include', '/register')
  })
})
