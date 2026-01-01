const axios = require('axios');

const registerUser = async (user) => {
    try {
        await axios.post('http://localhost:5000/api/auth/register', user);
        console.log(`Successfully registered ${user.name}`);
    } catch (error) {
        if (error.response && error.response.data && error.response.data.message === 'User already exists') {
            console.log(`${user.name} already exists.`);
        } else {
            console.error(`Failed to register ${user.name}:`, error.message);
        }
    }
};

const main = async () => {
    const doctors = [
        {
            name: 'Dr. Emily Stones',
            email: 'emily@example.com',
            password: 'password123',
            role: 'doctor',
            specialization: 'Pediatrician',
            confirmedPassword: 'password123'
        },
        {
            name: 'Dr. John Watson',
            email: 'john@example.com',
            password: 'password123',
            role: 'doctor',
            specialization: 'Cardiologist',
            confirmedPassword: 'password123'
        },
        {
            name: 'Dr. Sarah Smith',
            email: 'sarah@example.com',
            password: 'password123',
            role: 'doctor',
            specialization: 'Dermatologist',
            confirmedPassword: 'password123'
        }
    ];

    console.log("Starting registration process...");
    for (const doc of doctors) {
        await registerUser(doc);
    }
    console.log("Done.");
};

main();
