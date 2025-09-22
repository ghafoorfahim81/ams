import React from 'react';
// *** FINALIZED FIX: Alias + Explicit .jsx Extension ***
import { Button } from '@/Components/ui/button.jsx';
import { Input } from '@/Components/ui/input.jsx';
import { Label } from '@/Components/ui/label.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select.jsx';
import { Textarea } from '@/Components/ui/textarea.jsx';
// *************************************************
import { MinusCircle, PlusCircle } from 'lucide-react';

const ParticipantsForm = ({ data, setData, onNext, onBack, errors }) => {

    const updateParticipant = (index, field, value) => {
        const newParticipants = data.participants.map((p, i) => {
            if (i === index) {
                return { ...p, [field]: value };
            }
            return p;
        });
        setData('participants', newParticipants);
    };

    const addParticipant = () => {
        setData('participants', [...data.participants, { full_name: '', relation: '', identification_number: '' }]);
    };

    const removeParticipant = (index) => {
        if (data.participants.length > 1) {
            setData('participants', data.participants.filter((_, i) => i !== index));
        }
    };
    
    // Basic validation to enable 'Next' button
    const isFormValid = data.participants.every(p => p.full_name.trim() !== '' && p.identification_number.trim() !== '');

    return (
        <form onSubmit={(e) => { e.preventDefault(); onNext(); }}>
            <div className="space-y-6">
                
                {/* Participant Forms */}
                {data.participants.map((participant, index) => (
                    <div key={index} className="border p-4 rounded-lg bg-gray-50">
                        <div className="flex justify-between items-center mb-4">
                            <h4 className="font-bold">Participant #{index + 1}</h4>
                            {data.participants.length > 1 && (
                                <Button 
                                    type="button" 
                                    variant="destructive" 
                                    size="sm"
                                    onClick={() => removeParticipant(index)}
                                >
                                    <MinusCircle className="w-4 h-4 mr-1" /> Remove
                                </Button>
                            )}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor={`full_name_${index}`}>Full Name</Label>
                                <Input
                                    id={`full_name_${index}`}
                                    value={participant.full_name}
                                    onChange={(e) => updateParticipant(index, 'full_name', e.target.value)}
                                    placeholder="Full Name"
                                    required
                                />
                                {errors[`participants.${index}.full_name`] && <p className="text-xs text-red-500">{errors[`participants.${index}.full_name`]}</p>}
                            </div>
                            
                            <div className="space-y-2">
                                <Label htmlFor={`relation_${index}`}>Relationship</Label>
                                <Select
                                    value={participant.relation}
                                    onValueChange={(value) => updateParticipant(index, 'relation', value)}
                                >
                                    <SelectTrigger id={`relation_${index}`}>
                                        <SelectValue placeholder="Select" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="self">Self</SelectItem>
                                        <SelectItem value="family">Family</SelectItem>
                                        <SelectItem value="other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors[`participants.${index}.relation`] && <p className="text-xs text-red-500">{errors[`participants.${index}.relation`]}</p>}
                            </div>

                             <div className="space-y-2 md:col-span-3">
                                <Label htmlFor={`id_number_${index}`}>Identification Number (ID)</Label>
                                <Input
                                    id={`id_number_${index}`}
                                    value={participant.identification_number}
                                    onChange={(e) => updateParticipant(index, 'identification_number', e.target.value)}
                                    placeholder="National ID, Passport No, etc."
                                    required
                                />
                                {errors[`participants.${index}.identification_number`] && <p className="text-xs text-red-500">{errors[`participants.${index}.identification_number`]}</p>}
                            </div>
                        </div>
                    </div>
                ))}
                
                <Button type="button" variant="outline" onClick={addParticipant} className="w-full">
                    <PlusCircle className="w-4 h-4 mr-2" /> Add Another Participant
                </Button>
                
                {/* Notes Field */}
                <div className="space-y-2">
                    <Label htmlFor="notes">Notes (Optional)</Label>
                    <Textarea 
                        id="notes" 
                        value={data.notes || ''}
                        onChange={(e) => setData('notes', e.target.value)}
                        placeholder="Any special requests or important information..."
                    />
                    {errors.notes && <p className="text-xs text-red-500">{errors.notes}</p>}
                </div>
                
                {/* Navigation */}
                <div className="flex justify-between pt-4">
                    <Button type="button" variant="outline" onClick={onBack}>
                        &larr; Back to Date/Time
                    </Button>
                    <Button type="submit" disabled={!isFormValid}>
                        Review & Confirm &rarr;
                    </Button>
                </div>
            </div>
        </form>
    );
};

export default ParticipantsForm;