<?php

namespace App\Http\Controllers\Administration;

use App\Http\Controllers\Controller;
use App\Http\Requests\Administration\UserStoreRequest;
use App\Http\Requests\Administration\UserUpdateRequest;
use App\Http\Resources\Administration\UserResource;
use App\Models\HR\Employee;
use App\Models\User;
use App\Services\FileHandler;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $users = User::with(['roles', 'createdBy'])
            ->search($request->query('q'))
            ->sort($request->sort_by)
            ->paginate();

        return inertia('Users/Index', [
            'users' => $users->toResourceCollection(UserResource::class),
        ]);
    }

    public function create()
    {
        $employees = Employee::take(10)->get();

        return Inertia::render('Users/Create', [
            'roles' => Role::all()->map(fn ($role): array => [
                'id' => $role->id,
                'name' => $role->name,
            ]),
            'permissions' => Permission::all()->pluck('name'),
            'employees' => $employees,
        ]);
    }

    public function store(UserStoreRequest $request, FileHandler $fileHandler): RedirectResponse
    {
        $validated = $request->validated();

        if ($request->hasFile('avatar')) {
            $validated['avatar'] = $fileHandler->upload($request->file('avatar'), 'avatars');
        }

        $validated['password'] = Hash::make($request->input('password'));

        $user = User::create($validated);

        if ($request->has('role')) {
            $user->assignRole($request->input('role'));
        }

        if ($request->has('permissions')) {
            $user->syncPermissions($request->input('permissions'));
        }

        return redirect()->route('users.index');
    }

    public function edit(User $user)
    {
        return Inertia::render('Users/Edit', [
            'user' => $user->load(['roles', 'permissions'])->toResource(UserResource::class),
            'roles' => Role::all()->map(fn ($role): array => [
                'id' => $role->id,
                'name' => $role->name,
            ]),
            'permissions' => Permission::all()->pluck('name'),
        ]);
    }

    public function show(User $user)
    {
        return Inertia::render('Users/View', [
            'user' => $user->load(['roles', 'createdBy', 'updatedBy'])->toResource(UserResource::class),
        ]);
    }

    public function update(UserUpdateRequest $request, User $user, FileHandler $fileHandler): RedirectResponse
    {
        $validated = $request->validated();

        if ($request->hasFile('avatar')) {
            if ($user->avatar) {
                $fileHandler->delete($user->avatar);
            }
            $validated['avatar'] = $fileHandler->upload($request->file('avatar'), 'avatars');
        }

        if ($request->filled('password')) {
            $validated['password'] = Hash::make($request->password);
        } else {
            unset($validated['password']);
        }

        $user->update($validated);

        $user->syncRoles([$request->role]);

        // Update permissions if provided
        if ($request->has('permissions')) {
            $user->syncPermissions($request->permissions);
        }

        return redirect()->route('users.index');
    }

    public function destroy(User $user): RedirectResponse
    {
        $user->delete();

        return redirect()->route('users.index');
    }
}
