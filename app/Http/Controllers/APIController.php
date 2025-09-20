<?php

namespace App\Http\Controllers;

use App\Models\HR\Directorate;
use App\Models\HR\Employee;
use Illuminate\Support\Facades\Http;

class APIController extends Controller
{
    public static function getDirectoratesFromLocalHR()
    {
        $insertData = [];
        $avialableDirectorates = [];
        $isRecordModefied = false;
        $headers = ['Accept' => 'application/json'];
        $directorates = Http::get('http://172.30.23.11/local/public/api/inventory-system/get-directorates', $headers);
        $directorates = json_decode($directorates, true);
        $directorateModel = (new Directorate);
        $avialableDirectorates = $directorateModel::all();

        foreach ($directorates as $directorate) {
            $insertData[] = [
                'id' => $directorate['id'],
                'name_en' => $directorate['name_en'],
                'name_fa' => $directorate['name'],
                'name_ps' => $directorate['name_pa'],
                'parent_id' => $directorate['parent'],
            ];
        }

        foreach ($insertData as $key => $insertDir) {
            foreach ($avialableDirectorates as $avialableDir) {
                if ($avialableDir->id == $insertDir['id']) {
                    if (
                        $avialableDir->name_en !== $insertDir['name_en']
                        || $avialableDir->name_fa !== $insertDir['name_fa']
                        || $avialableDir->name_ps !== $insertDir['name_ps']
                        || $avialableDir->parent_id !== $insertDir['parent_id']
                    ) {
                        $isRecordModefied = $directorateModel::where('id', '=', $insertDir['id'])->update([
                            'name_en' => $insertDir['name_en'],
                            'name_fa' => $insertDir['name_fa'],
                            'name_ps' => $insertDir['name_ps'],
                            'parent_id' => $insertDir['parent_id'],
                        ]);
                    }
                    unset($insertData[$key]);
                    break;
                }
            }
        }

        if ($insertData !== []) {
            $isRecordModefied = $directorateModel::insert($insertData);
        }
        unset($insertData);
        if ($isRecordModefied === false) {
            return response()->json('Directorates are not modefied or inserted');
        }

        return response()->json('Directorates are modefied or inserted');
    }

    // this function is for migrating employees from local auth database
    public static function getEmployeesFromLocalHR()
    {
        $headers = ['Accept' => 'application/json'];
        $employees = Http::get('http://172.30.23.11/local/public/api/inventory-system/get-employees', $headers)->throw();
        $employees = $employees->json();
        $employeeModel = new Employee;
        $isRecordModified = false;

        // Get the IDs of all existing employees
        $existingIds = $employeeModel->pluck('id')->toArray();

        // Split the employees into chunks of 3000 records for faster insertions
        $chunkedEmployees = array_chunk($employees, 3000);

        // Loop through each chunk of employees
        foreach ($chunkedEmployees as $chunk) {
            $insertData = [];

            // Loop through each employee in the chunk
            foreach ($chunk as $employee) {
                // Check if the employee already exists in the database
                if (in_array($employee['id'], $existingIds)) {
                    $existingEmployee = $employeeModel->find($employee['id']);

                } else {
                    // Add the employee record to the insert data
                    $insertData[] = $employee;
                }
            }

            // Insert any new employee records
            if ($insertData !== []) {
                $employeeModel->insert($insertData);
                $isRecordModified = true;
            }
        }

        // Return a response based on whether any records were modified or inserted
        if ($isRecordModified) {
            return response()->json('Employees were modified or inserted');
        } else {
            return response()->json('Employees were not modified or inserted');
        }
    }

    // This function return the employee ownership card for local system

}
