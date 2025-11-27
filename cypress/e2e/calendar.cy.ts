describe('Calendar View', () => {
  beforeEach(() => {
    cy.login('admin', 'admin123');
    // Navigate from dashboard to calendar
    cy.get('.btn-secondary').contains('Ver Calendario').click();
    cy.url().should('include', '/tasks/calendar');
    cy.wait(1000); // Wait for calendar to render
  });

  it('should display calendar page', () => {
    cy.get('h1').should('contain', 'Calendario de Tareas');
    cy.get('.calendar-grid').should('be.visible');
  });

  it('should display calendar legend', () => {
    cy.get('.calendar-legend-top').should('be.visible');
    cy.get('.legend-item').should('have.length.at.least', 4);
    cy.contains('.legend-item', 'Alta').should('be.visible');
    cy.contains('.legend-item', 'Media').should('be.visible');
    cy.contains('.legend-item', 'Baja').should('be.visible');
  });

  it('should navigate between months', () => {
    cy.get('.btn-nav').first().click(); // Previous month
    cy.get('.month-title').should('be.visible');
    
    cy.get('.btn-nav').eq(1).click(); // Next month
    cy.get('.month-title').should('be.visible');
  });

  it('should navigate to today', () => {
    cy.get('.btn-today').contains('Hoy').click();
    cy.get('.calendar-day.today').should('exist');
  });

  it('should select a day', () => {
    // Click on a day that is not from other month
    cy.get('.calendar-day').not('.other-month').first().click();
    // Wait to ensure click is processed
    cy.wait(500);
  });

  it('should display calendar days', () => {
    cy.get('.calendar-day').should('have.length.at.least', 28);
    cy.get('.weekday-header').should('have.length', 7);
  });

  it('should navigate to task list', () => {
    cy.get('.btn-primary').contains('Lista').click();
    cy.url().should('include', '/tasks');
  });

  it('should navigate back to dashboard', () => {
    cy.get('.btn-back').click();
    cy.url().should('include', '/dashboard');
  });
});
