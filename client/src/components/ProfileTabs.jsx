import React from 'react';
import * as Tabs from '@radix-ui/react-tabs';

export default function ProfileTabs() {
  return (
    <Tabs.Root defaultValue="info" className="w-full">
      <Tabs.List className="flex gap-2 border-b border-gray-200 pb-2 mb-4">
        <Tabs.Trigger 
            value="info" 
            className="px-3 py-1 rounded-md text-sm font-medium text-gray-600 hover:text-primary data-[state=active]:bg-primary data-[state=active]:text-white transition-colors"
        >
            Info
        </Tabs.Trigger>
        <Tabs.Trigger 
            value="appointments" 
            className="px-3 py-1 rounded-md text-sm font-medium text-gray-600 hover:text-primary data-[state=active]:bg-primary data-[state=active]:text-white transition-colors"
        >
            Appointments
        </Tabs.Trigger>
        <Tabs.Trigger 
            value="reviews" 
            className="px-3 py-1 rounded-md text-sm font-medium text-gray-600 hover:text-primary data-[state=active]:bg-primary data-[state=active]:text-white transition-colors"
        >
            Reviews
        </Tabs.Trigger>
      </Tabs.List>

      <Tabs.Content value="info" className="p-2 outline-none">
        <p className="text-sm text-gray-700">Doctor biography and details go here.</p>
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold text-gray-900">Education</h4>
            <p className="text-sm text-gray-600">MBBS, MD - Cardiology</p>
        </div>
      </Tabs.Content>

      <Tabs.Content value="appointments" className="p-2 outline-none">
        <p className="text-sm text-gray-700">Appointment history list.</p>
        <div className="mt-4 border rounded-md p-4 flex justify-between items-center bg-gray-50">
            <div>
                <p className="font-medium text-gray-900">Sep 12, 2023</p>
                <p className="text-xs text-gray-500">10:00 AM - 10:30 AM</p>
            </div>
            <span className="text-xs font-semibold text-green-600 bg-green-100 px-2 py-1 rounded">Completed</span>
        </div>
      </Tabs.Content>

      <Tabs.Content value="reviews" className="p-2 outline-none">
        <p className="text-sm text-gray-700">Patient reviews</p>
        <div className="mt-4">
            <div className="flex items-center gap-2 mb-2">
                <div className="h-8 w-8 rounded-full bg-slate-200"></div>
                <div>
                    <p className="text-sm font-medium">John Doe</p>
                    <p className="text-xs text-yellow-500">★★★★★</p>
                </div>
            </div>
            <p className="text-sm text-gray-600 italic">"Great doctor, very patient!"</p>
        </div>
      </Tabs.Content>
    </Tabs.Root>
  );
}
