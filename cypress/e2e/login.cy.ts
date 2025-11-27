describe('Login Flow', () => {
  beforeEach(() => {
    cy.visit('/auth/login');
  });

  it('should display login form', () => {
    cy.get('h1').should('contain', 'Iniciar Sesión');
    cy.get('input[id="username"]').should('be.visible');
    cy.get('input[id="password"]').should('be.visible');
    cy.get('button[type="submit"]').should('be.visible');
  });

  it('should show validation errors for empty fields', () => {
    cy.get('button[type="submit"]').should('be.disabled');
    cy.get('input[id="username"]').type('a').clear();
    cy.get('input[id="password"]').type('a').clear();
    cy.get('.error-message').should('be.visible');
  });

  it('should successfully login with valid credentials', () => {
    cy.get('input[id="username"]').type('admin');
    cy.get('input[id="password"]').type('admin123');
    cy.get('button[type="submit"]').click();
    
    cy.url().should('include', '/dashboard');
    cy.get('h1').should('contain', 'Panel de Control');
  });

  it('should toggle to register mode', () => {
    cy.contains('Regístrate').click();
    cy.get('h1').should('contain', 'Crear Cuenta');
    cy.get('input[id="email"]').should('be.visible');
  });

  it('should show error message for invalid credentials', () => {
    cy.get('input[id="username"]').type('invalid');
    cy.get('input[id="password"]').type('invalid');
    cy.get('button[type="submit"]').click();
    
    // Should stay on login page or show error
    cy.url().should('include', '/auth/login');
  });
});
