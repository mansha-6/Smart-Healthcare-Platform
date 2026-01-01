import React from 'react';
import { useAuth } from '../../context/AuthContext';

const PatientProfileCard = () => {
    const { user } = useAuth();

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm">
            <div className="flex flex-col items-center mb-6">
                <img 
                    src={user?.gender?.toLowerCase() === 'female' 
                        ? "/avatars/female.svg" 
                        : "/avatars/male.svg"}
                    alt="Patient" 
                    className="w-20 h-20 rounded-full mb-3 object-contain bg-gray-50 border border-gray-100 p-1"
                />
                <h3 className="text-xl font-bold text-gray-800">{user?.name || "Patient Name"}</h3>
                <p className="text-sm text-gray-500">24 year | {user?.gender || 'Male'}</p>
            </div>

            <div className="space-y-3">
                <div className="flex justify-between text-sm">
                   <span className="text-gray-500">Details</span>
                   <span className="font-semibold text-teal-600">Patient ID: #{user?._id?.slice(-6) || '---'}</span>
                </div>
                <hr className="border-gray-100" />
                
                <div className="grid grid-cols-2 gap-y-3 text-sm">
                    <span className="text-gray-500 font-medium">Blood Group :</span>
                    <span className="font-semibold text-gray-700">O+</span>

                    <span className="text-gray-500 font-medium">BMI :</span>
                    <span className="font-semibold text-gray-700">24.5</span>

                    <span className="text-gray-500 font-medium">Height :</span>
                    <span className="font-semibold text-gray-700">5.8 ft</span>

                    <span className="text-gray-500 font-medium">Weight :</span>
                    <span className="font-semibold text-gray-700">55 kg</span>

                    <span className="text-gray-500 font-medium">Contact :</span>
                    <span className="font-semibold text-gray-700">8453845445</span>
                </div>
            </div>
        </div>
    );
};

export default PatientProfileCard;
