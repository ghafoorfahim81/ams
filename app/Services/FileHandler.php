<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class FileHandler
{
    /**
     * Uploads a file and returns the file path.
     */
    public function upload(UploadedFile $file, string $directory = 'uploads'): string
    {
        $filename = uniqid().'_'.$file->getClientOriginalName();

        $path = $file->storeAs($directory, $filename, 'public');

        return Storage::url($path);
    }

    /**
     * Deletes a file by path.
     */
    public function delete(string $path): bool
    {
        return Storage::disk('public')->delete($path);
    }
}
