const registerUser = async (user) => {
    try {
        const response = await fetch('http://127.0.0.1:5000/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        });

        if (response.ok) {
            console.log(`Successfully registered ${user.name}`);
        } else {
            const data = await response.json();
            if (data.message === 'User already exists') {
                console.log(`${user.name} already exists.`);
            } else {
                console.error(`Failed to register ${user.name}:`, data.message);
            }
        }
    } catch (error) {
        console.error(`Error registering ${user.name}:`, error.message);
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
            fees: 60,
            experience: 5
        },
        {
            name: 'Dr. John Watson',
            email: 'john@example.com',
            password: 'password123',
            role: 'doctor',
            specialization: 'Cardiologist',
            fees: 100,
            experience: 12
        },
        {
            name: 'Dr. Sarah Smith',
            email: 'sarah@example.com',
            password: 'password123',
            role: 'doctor',
            specialization: 'Dermatologist',
            fees: 80,
            experience: 8
        }
    ];

    console.log("Starting registration process via Fetch...");
    for (const doc of doctors) {
        await registerUser(doc);
    }
    console.log("Done.");
};

main();
