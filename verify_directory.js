const axios = require('axios');
require('dotenv').config();

const BASE_URL = 'http://localhost:5000/api';

async function verify() {
    try {
        // 1. Login as Patient to get token
        console.log('Logging in as patient...');
        // Using a hardcoded patient from previous logs or created one
        // If this fails, I'll need to register one, but let's try a known one or just register a temp one
        let token;
        try {
            const loginRes = await axios.post(`${BASE_URL}/auth/login`, {
                email: 'dhrumisoni@gmail.com', // Found in debug_users output
                password: 'password123' // Guessing, or I can create a new user
            });
            token = loginRes.data.token;
            console.log('Login successful. Token acquired.');
        } catch (e) {
            console.log('Login failed (likely wrong password). Creating temp user...');
            const rand = Math.floor(Math.random() * 1000);
            const regRes = await axios.post(`${BASE_URL}/auth/register`, {
                name: `Test Patient ${rand}`,
                email: `testpatient${rand}@example.com`,
                password: 'password123',
                role: 'patient',
                confirmPassword: 'password123'
            });
            token = regRes.data.token;
            console.log('Temp user registered. Token acquired.');
        }

        const config = { headers: { Authorization: `Bearer ${token}` } };

        // 2. Test Get All Patients
        console.log('Testing GET /patient/all ...');
        const patientsRes = await axios.get(`${BASE_URL}/patient/all`, config);
        console.log(`Success! Found ${patientsRes.data.length} patients.`);

        // 3. Test Get Doctor Mappings
        console.log('Testing GET /doctor/patient-mappings ...');
        const mapRes = await axios.get(`${BASE_URL}/doctor/patient-mappings`, config);
        console.log(`Success! Found ${mapRes.data.length} doctor mappings.`);
        
        if (mapRes.data.length > 0) {
            console.log('Sample Mapping:', JSON.stringify(mapRes.data[0], null, 2));
        }

    } catch (error) {
        console.error('Verification Failed:', error.response ? error.response.data : error.message);
    }
}

verify();
