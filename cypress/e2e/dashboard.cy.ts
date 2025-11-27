describe('Dashboard', () => {
  beforeEach(() => {
    cy.login('admin', 'admin123');
  });

  it('should display dashboard with user info', () => {
    cy.get('.user-info h2').should('contain', 'Hola, admin!');
    cy.get('.btn-logout').should('be.visible');
  });

  it('should display task statistics', () => {
    cy.get('.stat-card.stat-total').should('be.visible');
    cy.get('.stat-card.stat-completed').should('be.visible');
    cy.get('.stat-card.stat-pending').should('be.visible');
    cy.get('.stat-card.stat-progress').should('be.visible');
  });

  it('should navigate to tasks list', () => {
    cy.contains('Ver Todas las Tareas').click();
    cy.url().should('include', '/tasks');
  });

  it('should navigate to calendar', () => {
    cy.contains('Ver Calendario').click();
    cy.url().should('include', '/tasks/calendar');
  });

  it('should logout successfully', () => {
    cy.logout();
  });

  it('should display footer with copyright', () => {
    cy.get('.app-footer').should('be.visible');
    cy.get('.app-footer').should('contain', 'TaskApp');
    cy.get('.app-footer').should('contain', new Date().getFullYear());
  });
});
