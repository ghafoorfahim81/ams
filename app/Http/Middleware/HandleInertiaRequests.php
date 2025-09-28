<?php

namespace App\Http\Middleware;

use App\Enums\{Status, Type};
use App\Http\Resources\Service\ServiceCategoryResource;
use App\Models\Service\ServiceCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    protected const MODEL_RESOURCE_MAP = [
        'service_categories' => [
            'model' => ServiceCategory::class,
            'resource' => ServiceCategoryResource::class,
            'limit' => 10,
        ],
    ];

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    public function share(Request $request): array
    {
        // This is the core update. We are now sharing the user's roles in addition to their permissions.
        $user = $request->user();

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $user ? [
                    'id' => $user->id,
                    'full_name' => $user->full_name,
                    'email' => $user->email,
                    'roles' => $user->roles->pluck('name')->toArray(), // Added this line
                    'user_permissions' => $user->getAllPermissions()->pluck('name')->toArray(),
                ] : null,
            ],
            ...$this->getCachedModelData(),
            ...$this->getCachedEnumData(),
        ];
    }

    protected function getCachedModelData(): array
    {
        $locale = app()->getLocale();
        $cacheDuration = 3600;

        $data = [];

        foreach (self::MODEL_RESOURCE_MAP as $key => $config) {
            $cacheKey = "{$key}_{$locale}";
            $model = $config['model'];
            $resource = $config['resource'];

            $data[$key] = Cache::remember($cacheKey, $cacheDuration, function () use ($model, $resource, $config) {
                $query = $model::oldest();
                if (isset($config['limit'])) {
                    $query->take($config['limit']);
                }

                return $resource::collection($query->get());
            });
        }

        return $data;
    }

    protected function getCachedEnumData(): array
    {

        return [
            'types' => [
                'data' => $this->cacheEnum(Type::class, "types"),
            ],
            'statuses' => [
                'data' => $this->cacheEnum(Status::class, "statuses"),
            ]

        ];
    }

    protected function cacheEnum(string $enumClass, string $cacheKey)
    {
        return Cache::rememberForever($cacheKey,
            fn () => collect($enumClass::cases())->map(fn ($item): array => [
                'id' => $item->value,
                'name' => $item->getLabel(),
            ]));
    }
}