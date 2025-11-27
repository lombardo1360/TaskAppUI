describe('Task Management', () => {
  beforeEach(() => {
    cy.login('admin', 'admin123');
    // Navigate from dashboard to tasks
    cy.get('.btn-primary').contains('Ver Todas las Tareas').click();
    cy.url().should('include', '/tasks');
    cy.wait(1000); // Wait for tasks to load
  });

  it('should display task list page', () => {
    cy.get('h1').should('contain', 'Mis Tareas');
    cy.get('.btn-create').should('be.visible');
  });

  it('should open create task form', () => {
    cy.get('.btn-create').click();
    cy.get('.form-overlay').should('be.visible');
    cy.get('#modal-title').should('contain', 'Nueva Tarea');
  });

  it('should create a new task', () => {
    cy.get('.btn-create').click();
    
    cy.get('input[id="title"]').type('Test Task from Cypress');
    cy.get('textarea[id="description"]').type('This is a test task created by Cypress');
    cy.get('select[formControlName="priority"]').select('2'); // Alta
    cy.get('input[id="dueDate"]').type('2025-12-31');
    
    cy.get('button[type="submit"]').click();
    
    // Should show success toast
    cy.get('.toast', { timeout: 5000 }).should('be.visible');
  });

  it('should filter tasks', () => {
    cy.get('.filter-btn').contains('Pendientes').click();
    cy.get('.filter-btn.active').should('contain', 'Pendientes');
    
    cy.get('.filter-btn').contains('Completadas').click();
    cy.get('.filter-btn.active').should('contain', 'Completadas');
    
    cy.get('.filter-btn').contains('Todas').click();
    cy.get('.filter-btn.active').should('contain', 'Todas');
  });

  it('should mark task as completed', () => {
    // First create a task
    cy.get('.btn-create').click();
    cy.get('#title').type('Task to complete');
    cy.get('button[type="submit"]').click();
    cy.wait(1000);
    
    // Verify task exists and mark it as completed
    cy.contains('.task-card', 'Task to complete').should('exist').within(() => {
      cy.get('input[type="checkbox"]').click({ force: true });
    });
    cy.wait(500);
  });

  it('should edit a task', () => {
    // First create a task
    cy.get('.btn-create').click();
    cy.get('#title').type('Task to edit');
    cy.get('button[type="submit"]').click();
    cy.wait(1000);
    
    // Verify task exists and edit it
    cy.contains('.task-card', 'Task to edit').should('exist').within(() => {
      cy.get('.btn-edit').click();
    });
    
    cy.get('.form-overlay').should('be.visible');
    cy.get('#modal-title').should('contain', 'Editar Tarea');
    
    cy.get('input[id="title"]').clear().type('Task edited');
    cy.get('button[type="submit"]').click();
    cy.wait(1000);
    cy.contains('Task edited').should('exist');
  });

  it('should delete a task', () => {
    // First create a task
    cy.get('.btn-create').click();
    cy.get('#title').type('Task to delete');
    cy.get('button[type="submit"]').click();
    cy.wait(1000);
    
    // Verify task exists and delete it
    cy.contains('.task-card', 'Task to delete').should('exist').within(() => {
      cy.get('.btn-delete').click();
    });
    
    // Confirm deletion in modal
    cy.get('.modal-container').should('be.visible');
    cy.contains('button', 'Confirmar').click();
    cy.wait(500);
  });

  it('should navigate back to dashboard', () => {
    cy.get('.btn-back').click();
    cy.url().should('include', '/dashboard');
  });
});
