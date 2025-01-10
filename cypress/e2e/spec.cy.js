describe('Student Management System', () => {
  let baseUrl;
  //let baseUrl;
  before(() => {
    cy.task('startServer').then((url) => {
      baseUrl = url; // Store the base URL
      cy.visit(baseUrl);
    });
  });
  after(() => {
    return cy.task('stopServer'); // Stop the server after the report is done
  });

  it('should go to Student Management and update all student fields', () => {
    // Visit the dynamically obtained base URL
    
    
    // Step 1: Go to the Student Management page from the home screen
    cy.get('a.btn-secondary').contains('Go to Student Management').click();

    // Step 2: Click the Update button for the first student (this assumes an update button exists)
    cy.get('button').contains('Update').first().should('be.visible').click();

    // Step 3: Change the "firstName" field
    cy.get('#firstName').clear().type('Updated First Name', { force: true });

    // Step 4: Change the "lastName" field
    cy.get('#lastName').clear().type('Updated Last Name', { force: true });

    // Step 5: Change the "dateOfBirth" field
    cy.get('#dateOfBirth').clear().type('2024-11-03', { force: true });

    // Step 6: Change the "gender" field
    cy.get('#gender').select('Female');  // Assuming it's a <select> dropdown

    // Step 7: Change the "emailAddress" field
    cy.get('#email').clear().type('updatedemail@example.com', { force: true });

    // Step 8: Change the "phoneNumber" field
    cy.get('#phone').clear().type('9876543210', { force: true });

    // Step 9: Change the "course" field
    cy.get('#course').select('Information Technology'),

    // Step 10: Change the "yearOfStudy" field
    cy.get('#yearOfStudy').clear().type('3', { force: true });

    // Step 11: Submit the updated student information
    cy.get('button.submit-button').click();

    // Step 12: Verify that the updated details are displayed correctly
    cy.get('#studentList').contains('Updated First Name').should('exist');
    cy.get('#studentList').contains('Updated Last Name').should('exist');
    cy.get('#studentList').contains('2024-11-03').should('exist');
    cy.get('#studentList').contains('Female').should('exist');
    cy.get('#studentList').contains('updatedemail@example.com').should('exist');
    cy.get('#studentList').contains('9876543210').should('exist');
    cy.get('#studentList').contains('Information Technology').should('exist');
    cy.get('#studentList').contains('3').should('exist');
});

  it('should not allow user to update email with invalid email format', () => {
    cy.visit(baseUrl);
    cy.get('a.btn-secondary').contains('Go to Student Management').click();

    // Step 2: Click the Update button for the first student (this assumes an update button exists)
    cy.get('button').contains('Update').first().should('be.visible').click();

    // Step 3: Change the "email" field with an invalid email format
    cy.get('#email').clear().type('Invalid Email Format', { force: true });

    // Step 4: Submit the updated student information
    cy.get('button.submit-button').click();

    // Intercept and assert the alert message
    cy.on('window:alert', (alertText) => {
      expect(alertText).to.equal('Could not update student details. Please try again.');
    });

  });
  it('should not allow user to update phone number with invalid phone number format', () => {
    cy.visit(baseUrl);
    cy.get('a.btn-secondary').contains('Go to Student Management').click();

    // Step 2: Click the Update button for the first student (this assumes an update button exists)
    cy.get('button').contains('Update').first().should('be.visible').click();

    // Step 3: Change the "phone" field with an invalid phone number format
    cy.get('#phone').clear().type('1234567', { force: true });

    // Step 4: Submit the updated student information
    cy.get('button.submit-button').click();

    // Intercept and assert the alert message
    cy.on('window:alert', (alertText) => {
      expect(alertText).to.equal('Could not update student details. Please try again.');
    });
    
  });
  it('should not allow user to update year of study with invalid format', () => {
    cy.visit(baseUrl);
    cy.get('a.btn-secondary').contains('Go to Student Management').click();

    // Step 2: Click the Update button for the first student (this assumes an update button exists)
    cy.get('button').contains('Update').first().should('be.visible').click();

    // Step 3: Change the "phone" field with an invalid phone number format
    cy.get('#yearOfStudy').clear().type('123', { force: true });

    // Step 4: Submit the updated student information
    cy.get('button.submit-button').click();

    // Intercept and assert the alert message
    cy.on('window:alert', (alertText) => {
      expect(alertText).to.equal('Could not update student details. Please try again.');
    });
    
  });
});