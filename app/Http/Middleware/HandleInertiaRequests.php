<?php

namespace App\Http\Middleware;

use App\Enums\{FollowupType, InoutFlag, SaderaWareda, Status, Type};
use App\Http\Resources\Administration\{DocumentTypeResource, ExternalOrganizationResource, SecurityLevelResource};
use App\Http\Resources\HR\{DirectorateResource, EmployeeResource};
use App\Models\Administration\{DocumentType, ExternalOrganization, SecurityLevel};
use App\Models\HR\{Directorate, Employee};
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    protected const MODEL_RESOURCE_MAP = [

    ];

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    public function share(Request $request): array
    {

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user(),
                'user_permissions' => $request->user()?->getAllPermissions()->pluck('name')->toArray(),
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
        $locale = app()->getLocale();

        return [
            'types' => [
                'data' => $this->cacheEnum(Type::class, "types_{$locale}"),
            ],
            'statuses' => [
                'data' => $this->cacheEnum(Status::class, "statuses_{$locale}"),
            ],
            'inout_flags' => [
                'data' => $this->cacheEnum(InoutFlag::class, "inout_flags_{$locale}"),
            ],
            'followup_types' => [
                'data' => $this->cacheEnum(FollowupType::class, "followup_type_{$locale}"),
            ],
            'sader_waredas' => [
                'data' => $this->cacheEnum(SaderaWareda::class, "sader_waredas_{$locale}"),
            ],
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
