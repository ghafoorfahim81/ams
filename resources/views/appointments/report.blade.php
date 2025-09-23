<!DOCTYPE html>
<html>

<head>
    <title>Appointments Report</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            padding: 20px;
        }

        h1 {
            font-size: 16px;
            font-weight: bold;
            margin-bottom: 20px;
            color: #333;
        }

        .report-table {
            width: 100%;
            border-collapse: collapse;
        }

        .report-table th,
        .report-table td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
        }

        .report-table th {
            background-color: #f5f5f5;
            font-size: 16px;
        }

        .report-table tr th {
            font-size: 16px !important;
        }

        .report-table tr:nth-child(even) {
            background-color: #f9f9f9;
        }

        /* Column widths */
        .w-10 {
            width: 10%;
        }

        .w-20 {
            width: 20%;
        }

        .w-30 {
            width: 30%;
        }

        .text-center {
            text-align: center;
        }

        .thSize {
            font-size: 16px !important;
        }
    </style>
</head>

<body>
    <h1 class="text-center">Appointments Report</h1>
    <table class="report-table">
        <thead>
            <tr>
                <th class="w-10 thSize">Code</th>
                <th class="w-20 thSize">Service</th>
                <th class="w-20 thSize">Booked By</th>
                <th class="w-10 thSize">Type</th>
                <th class="w-10 thSize">Status</th>
                <th class="w-20 thSize">Scheduled Date</th>
                <th class="w-20 thSize">Start Time</th>
                <th class="w-20 thSize">End Time</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($appointments as $appointment)
                <tr>
                    <td>{{ $appointment->code }}</td>
                    <td>{{ $appointment->service->name }}</td>
                    <td>{{ $appointment->bookedByUser->full_name }}</td>
                    <td>{{ $appointment->type }}</td>
                    <td>{{ $appointment->status }}</td>
                    <td>{{ $appointment->scheduled_date }}</td>
                    <td>{{ $appointment->start_time }}</td>
                    <td>{{ $appointment->end_time }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>
</body>

</html>
