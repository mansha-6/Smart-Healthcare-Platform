const mongoose = require('mongoose');

// Hardcoded URI for internal docker network
const MONGO_URI = 'mongodb://mongo:27017/smart_healthcare';

// Define minimal Schemas to read data
const UserSchema = new mongoose.Schema({ name: String, email: String, role: String });
const PrescriptionSchema = new mongoose.Schema({ 
    patientId: mongoose.Schema.Types.ObjectId, 
    doctorId: mongoose.Schema.Types.ObjectId,
    date: Date,
    patientName: String
});

const User = mongoose.model('User', UserSchema);
const Prescription = mongoose.model('Prescription', PrescriptionSchema);

const verify = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('--- USERS ---');
        const users = await User.find({}, 'name email role _id');
        users.forEach(u => console.log(`${u.role.toUpperCase()} - ${u.name} (${u.email}): ${u._id}`));
        
        console.log('\n--- PRESCRIPTIONS ---');
        const prescriptions = await Prescription.find({});
        if (prescriptions.length === 0) {
            console.log('NO PRESCRIPTIONS FOUND.');
        } else {
            prescriptions.forEach(p => {
                console.log(`Prescription ${p._id}:`);
                console.log(`  DoctorID: ${p.doctorId}`);
                console.log(`  PatientID: ${p.patientId} (Name: ${p.patientName})`);
                console.log(`  Date: ${p.date}`);
            });
        }
        
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

verify();
