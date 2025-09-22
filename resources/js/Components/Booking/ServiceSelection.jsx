import React from 'react';
// *** FINALIZED FIX: Alias + Explicit .jsx Extension ***
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card.jsx';
import { Button } from '@/Components/ui/button.jsx';
// *************************************************

const ServiceSelection = ({ services, onSelect }) => {
    return (
        <div className="grid gap-6 md:grid-cols-2">
            {services.map(service => (
                <Card 
                    key={service.id} 
                    className="hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => onSelect(service)}
                >
                    <CardHeader>
                        <CardTitle>{service.name}</CardTitle>
                        <CardDescription>Duration: {service.duration} mins</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-gray-600 mb-4">{service.description}</p>
                        <Button variant="outline">Select Service</Button>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};

export default ServiceSelection;