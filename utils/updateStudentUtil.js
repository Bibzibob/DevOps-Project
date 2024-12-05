const fs = require('fs').promises; // Import the filesystem module
const { Student } = require('../models/studentModel.js'); // Import the Student class

const studentsFilePath = 'utils/students.json'; // Path to students JSON file

async function readJSON(filename) {
    try {
        const data = await fs.readFile(filename, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error(err);
        throw err; //stubbing
    }
}

async function writeJSON(object, filename) {
    try {
        await fs.writeFile(filename, JSON.stringify(object), 'utf8');
        return object;
    } catch (err) {
        console.error(err);
        throw err;
    }
}

async function readAllStudents(req, res) {
    try {
        const students = await readJSON(studentsFilePath);
        res.json(students); // Respond with JSON data
    } catch (error) {
        res.status(500).json({ message: 'Error reading students data', error: error.message });
    } 
}

async function getStudentById(req, res) {
    try {
        const studentID = req.params.id; // Get student ID from URL parameter
        const students = await readJSON(studentsFilePath); // Read all students

        // Find the student with the specified ID
        const student = students.find(s => s.id === studentID);

        if (!student) {
            return res.status(404).json({ message: 'Student not found.' });
        }

        // Respond with the student data
        res.json(student);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving student data', error: error.message });
    }
}


async function updateStudent(req, res) {
    try {
        const studentID = req.params.id; // Get the student ID from the URL parameter

        // Extract student details from the request body
        const {
            firstName,
            lastName,
            dateOfBirth,
            gender,
            emailAddress,
            phoneNumber,
            course,
            yearOfStudy,
        } = req.body;

        // Validation checks
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailAddress && !emailRegex.test(emailAddress)) {
            return res.status(400).json({ message: 'Invalid email format.' });
        }

        if (phoneNumber && (phoneNumber.length < 8 || phoneNumber.length > 15 || !/^\d+$/.test(phoneNumber))) {
            return res.status(400).json({ message: 'Phone number must be between 8 and 15 digits and contain only numbers.' });
        }

        if (gender && !['Male', 'Female', 'Other'].includes(gender)) {
            return res.status(400).json({ message: 'Invalid gender value.' });
        }

        if (yearOfStudy && ![1, 2, 3].includes(Number(yearOfStudy))) {
            return res.status(400).json({ message: 'Invalid year of study. It should be one of: 1, 2, 3.' });
        }

        // Read existing students from the JSON file
        const allStudents = await readJSON(studentsFilePath);

        // Find the student with the given ID (use studentID from URL parameter, not admissionID)
        const studentIndex = allStudents.findIndex(student => student.id === studentID);

        if (studentIndex === -1) {
            return res.status(404).json({ message: 'Student not found.' });
        }

        // Update student details
        const updatedStudent = {
            ...allStudents[studentIndex],
            firstName: firstName || allStudents[studentIndex].firstName,
            lastName: lastName || allStudents[studentIndex].lastName,
            dateOfBirth: dateOfBirth || allStudents[studentIndex].dateOfBirth,
            gender: gender || allStudents[studentIndex].gender,
            emailAddress: emailAddress || allStudents[studentIndex].emailAddress,
            phoneNumber: phoneNumber || allStudents[studentIndex].phoneNumber,
            course: course || allStudents[studentIndex].course,
            yearOfStudy: yearOfStudy || allStudents[studentIndex].yearOfStudy,
        };

        // Replace the old student data with the updated data
        allStudents[studentIndex] = updatedStudent;

        // Write updated data to the JSON file
        await writeJSON(allStudents, studentsFilePath);

        // Send success response
        return res.status(200).json({ message: 'Student updated successfully!', student: updatedStudent });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

module.exports = {
    readJSON,
    writeJSON,
    updateStudent,
    readAllStudents,
    getStudentById,
};