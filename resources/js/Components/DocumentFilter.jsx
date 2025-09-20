import React, { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import { usePage } from '@inertiajs/react';
import { Filter, X } from 'lucide-react';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger
} from '@/Components/ui/accordion';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/Components/ui/select';
import { trans } from '@/lib/utils';
import DatePicker from './DatePicker';

export default function DocumentFilter({
    directorates = [],
    documentTypes = [],
    securityLevels = [],
    statuses = [],
    typeOptions = []
}) {
    const { url } = usePage();
    const searchParams = new URLSearchParams(url.split("?")[1]);

    // Filter state
    const [filters, setFilters] = useState({
        title: searchParams.get('title') || '',
        sender_directorate_id: searchParams.get('sender_directorate_id') || '',
        receiver_directorate_id: searchParams.get('receiver_directorate_id') || '',
        status: searchParams.get('status') || '',
        out_date: searchParams.get('out_date') || '',
        in_date: searchParams.get('in_date') || '',
        type: searchParams.get('type') || '',
        security_level_id: searchParams.get('security_level_id') || '',
        out_num: searchParams.get('out_num') || '',
        in_num: searchParams.get('in_num') || '',
        document_type_id: searchParams.get('document_type_id') || '',
    });


    const applyFilters = () => {
        const params = new URLSearchParams();

        // Add search term if exists
        const searchTerm = searchParams.get('q');
        if (searchTerm) {
            params.set('q', searchTerm);
        }

        // Add sort if exists
        const sortBy = searchParams.get('sort_by');
        if (sortBy) {
            params.set('sort_by', sortBy);
        }

        // Add non-empty filters
        Object.entries(filters).forEach(([key, value]) => {
            if (value && value.trim() !== '') {
                params.set(key, value);
            }
        });

        router.get(route('documents.index'), Object.fromEntries(params), {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const clearFilters = () => {
        const clearedFilters = Object.keys(filters).reduce((acc, key) => {
            acc[key] = '';
            return acc;
        }, {});

        setFilters(clearedFilters);

        // Navigate with only search and sort params
        const params = new URLSearchParams();
        const searchTerm = searchParams.get('q');
        const sortBy = searchParams.get('sort_by');

        if (searchTerm) params.set('q', searchTerm);
        if (sortBy) params.set('sort_by', sortBy);

        router.get(route('documents.index'), Object.fromEntries(params), {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const updateFilter = (key, value) => {
        setFilters(prev => ({
            ...prev,
            [key]: value
        }));
    };


    const handleDateChange = (date, id) => {
        const formattedDate = date
            ? date.toDate().toISOString().split("T")[0]
            : "";
        setFilters(prev => ({
            ...prev,
            [id]: formattedDate
        }));
    };

    const translatedInDate = trans("doc:In_Date");
    const translatedOutDate = trans("doc:Out_Date");

    const hasActiveFilters = Object.values(filters).some(value => value && value.trim() !== '');

    return (
        <div className="w-full  ">
            <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="filters" className="border border-gray-200 rounded-lg">
                    <AccordionTrigger className="px-4 py-3 hover:no-underline">
                        <div className="flex items-center gap-2">
                            <Filter className="h-4 w-4" />
                            <span>{trans('doc:Advanced_Filters')}</span>
                            {hasActiveFilters && (
                                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                                    {Object.values(filters).filter(v => v && v.trim() !== '').length}
                                </span>
                            )}
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {/* Title Filter */}
                            <div className="space-y-2">
                                <Label htmlFor="title">{trans('doc:Title')}</Label>
                                <Input
                                    id="title"
                                    type="text"
                                    placeholder={trans('doc:Enter_Title')}
                                    value={filters.title}
                                    onChange={(e) => updateFilter('title', e.target.value)}
                                />
                            </div>

                            {/* Sender Directorate Filter */}
                            <div className="space-y-2">
                                <Label htmlFor="sender_directorate">{trans('doc:Sender_Directorate')}</Label>
                                <Select
                                    value={filters.sender_directorate_id}
                                    onValueChange={(value) => updateFilter('sender_directorate_id', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder={trans('doc:Select_Sender_Directorate')} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {directorates.map((directorate) => (
                                            <SelectItem key={directorate.id} value={directorate.id.toString()}>
                                                {directorate.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Receiver Directorate Filter */}
                            <div className="space-y-2">
                                <Label htmlFor="receiver_directorate">{trans('doc:Receiver_Directorate')}</Label>
                                <Select
                                    value={filters.receiver_directorate_id}
                                    onValueChange={(value) => updateFilter('receiver_directorate_id', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder={trans('doc:Select_Receiver_Directorate')} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {directorates.map((directorate) => (
                                            <SelectItem key={directorate.id} value={directorate.id.toString()}>
                                                {directorate.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Status Filter */}
                            <div className="space-y-2">
                                <Label htmlFor="status">{trans('doc:Doc_Status')}</Label>
                                <Select
                                    value={filters.status}
                                    onValueChange={(value) => updateFilter('status', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder={trans('doc:Select_Status')} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {statuses.map((status) => (
                                            <SelectItem key={status.id} value={status.id}>
                                                {status.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Out Date Filter */}
                            <div className="space-y-2">
                                <DatePicker
                                    id="out_date"
                                    label={translatedOutDate}
                                    placeholder={trans("Enter", {
                                        text: translatedOutDate,
                                    })}
                                    value={filters.out_date}
                                    onChange={(date) =>
                                        handleDateChange(date, "out_date")
                                    }
                                />
                            </div>

                            {/* In Date Filter */}
                            <div className="space-y-2">
                                <DatePicker
                                    id="in_date"
                                    label={translatedInDate}
                                    placeholder={trans("Enter", {
                                        text: translatedInDate,
                                    })}
                                    value={filters.in_date}
                                    onChange={(date) =>
                                        handleDateChange(date, "in_date")
                                    }
                                />
                            </div>

                            {/* Type Filter */}
                            <div className="space-y-2">
                                <Label htmlFor="type">{trans('doc:Type')}</Label>
                                <Select
                                    value={filters.type}
                                    onValueChange={(value) => updateFilter('type', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder={trans('doc:Select_Type')} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {typeOptions.map((type) => (
                                            <SelectItem key={type.id} value={type.id}>
                                                {type.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Security Level Filter */}
                            <div className="space-y-2">
                                <Label htmlFor="security_level">{trans('doc:Security_Level')}</Label>
                                <Select
                                    value={filters.security_level_id}
                                    onValueChange={(value) => updateFilter('security_level_id', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder={trans('doc:Select_Security_Level')} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {securityLevels.map((level) => (
                                            <SelectItem key={level.id} value={level.id.toString()}>
                                                {level.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Out Num Filter */}
                            <div className="space-y-2">
                                <Label htmlFor="out_num">{trans('doc:Out_Num')}</Label>
                                <Input
                                    id="out_num"
                                    type="text"
                                    placeholder={trans('doc:Enter_Out_Number')}
                                    value={filters.out_num}
                                    onChange={(e) => updateFilter('out_num', e.target.value)}
                                />
                            </div>

                            {/* In Num Filter */}
                            <div className="space-y-2">
                                <Label htmlFor="in_num">{trans('doc:In_Num')}</Label>
                                <Input
                                    id="in_num"
                                    type="text"
                                    placeholder={trans('doc:Enter_In_Number')}
                                    value={filters.in_num}
                                    onChange={(e) => updateFilter('in_num', e.target.value)}
                                />
                            </div>

                            {/* Document Type Filter */}
                            <div className="space-y-2">
                                <Label htmlFor="document_type">{trans('doc:Document_Type')}</Label>
                                <Select
                                    value={filters.document_type_id}
                                    onValueChange={(value) => updateFilter('document_type_id', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder={trans('doc:Select_Document_Type')} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {documentTypes.map((type) => (
                                            <SelectItem key={type.id} value={type.id.toString()}>
                                                {type.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Filter Actions */}
                        <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
                            <Button
                                variant="outline"
                                onClick={clearFilters}
                                disabled={!hasActiveFilters}
                                className="flex items-center gap-2"
                            >
                                <X className="h-4 w-4" />
                                {trans('doc:Clear_Filters')}
                            </Button>
                            <Button
                                onClick={applyFilters}
                                disabled={!hasActiveFilters}
                                className="flex items-center gap-2"
                            >
                                <Filter className="h-4 w-4" />
                                {trans('doc:Apply_Filters')}
                            </Button>
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    );
}
