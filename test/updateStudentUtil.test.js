const { describe, it, before, after } = require('mocha');
const { expect } = require('chai');
const { app, server } = require('../index'); // Adjust path if needed
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

let baseUrl;
let resourceId = '1731164559619762'; // Set resourceId to the given ID

describe('Student API', () => {
    before(async () => {
        const { address, port } = await server.address();
        baseUrl = `http://${address === '::' ? 'localhost' : address}:${port}`;

        
    });

    after((done) => {
        server.close(() => {
            done();
        });
    });

    // Test suite for getting all students
    describe('Retrieve all Student information', () => {
        it('should retrieve all students', (done) => {
            chai.request(baseUrl)
                .get('/students')
                .end((err, res) => {
                    expect(res).to.have.status(200);  // Status OK
                    expect(res.body).to.be.an('array');  // Response should be an array
                    done();
                });
        });
    });

    // Test suite for getting a student by ID
    describe('Retrieve Student information by ID', () => {
        it('should retrieve a student by ID', (done) => {
            chai.request(baseUrl)
                .get(`/students/${resourceId}`)
                .end((err, res) => {
                    expect(res).to.have.status(200);  // Status OK
                    expect(res.body).to.have.property('id').that.equals(resourceId);
                    done();
                });
        });
    });

    // Test suite for updating a student
describe('Update Student information by ID', () => {
    it('should update an existing student', (done) => {
        const updatedStudent = {
            admissionID: '2302776J', // Keeping original ID
            firstName: 'Updated First Name',
            lastName: 'Updated Last Name',
            dateOfBirth: '2024-11-03',
            gender: 'Female',
            emailAddress: 'updatedemail@example.com',
            phoneNumber: '9876543210',
            course: 'Information Technology',
            yearOfStudy: '3', // Assuming the year of study is updated
            id: resourceId  // Use the existing student ID
        };

        chai.request(baseUrl)
            .put(`/students/${resourceId}`)
            .send(updatedStudent)  // Sending all the updated fields
            .end((err, res) => {
                expect(res).to.have.status(200);  // Status OK
                expect(res.body.message).to.equal('Student updated successfully!');
                done();
            });
    });


        it('should return 404 if the student does not exist', (done) => {
            const nonExistentId = 'non-existent-id';
            chai.request(baseUrl)
                .get(`/students/${nonExistentId}`)
                .end((err, res) => {
                    expect(res).to.have.status(404);  // Not Found
                    expect(res.body.message).to.equal('Student not found.');  // Check error message with period
                    done();
                });
        });
    });
});
