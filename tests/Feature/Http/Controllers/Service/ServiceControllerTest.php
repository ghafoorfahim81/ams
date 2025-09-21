<?php

namespace Tests\Feature\Http\Controllers\Service;

use App\Models\Service;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use JMac\Testing\Traits\AdditionalAssertions;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

/**
 * @see \App\Http\Controllers\Service\ServiceController
 */
final class ServiceControllerTest extends TestCase
{
    use AdditionalAssertions, RefreshDatabase, WithFaker;

    #[Test]
    public function index_behaves_as_expected(): void
    {
        $services = Service::factory()->count(3)->create();

        $response = $this->get(route('services.index'));

        $response->assertOk();
        $response->assertJsonStructure([]);
    }


    #[Test]
    public function store_uses_form_request_validation(): void
    {
        $this->assertActionUsesFormRequest(
            \App\Http\Controllers\Service\ServiceController::class,
            'store',
            \App\Http\Requests\Service\ServiceStoreRequest::class
        );
    }

    #[Test]
    public function store_saves(): void
    {
        $name = fake()->name();
        $duration = fake()->numberBetween(-10000, 10000);
        $capacity_per_slot = fake()->numberBetween(-10000, 10000);
        $is_active = fake()->boolean();
        $is_emergency = fake()->boolean();
        $created_by = fake()->numberBetween(-10000, 10000);

        $response = $this->post(route('services.store'), [
            'name' => $name,
            'duration' => $duration,
            'capacity_per_slot' => $capacity_per_slot,
            'is_active' => $is_active,
            'is_emergency' => $is_emergency,
            'created_by' => $created_by,
        ]);

        $services = Service::query()
            ->where('name', $name)
            ->where('duration', $duration)
            ->where('capacity_per_slot', $capacity_per_slot)
            ->where('is_active', $is_active)
            ->where('is_emergency', $is_emergency)
            ->where('created_by', $created_by)
            ->get();
        $this->assertCount(1, $services);
        $service = $services->first();

        $response->assertCreated();
        $response->assertJsonStructure([]);
    }


    #[Test]
    public function show_behaves_as_expected(): void
    {
        $service = Service::factory()->create();

        $response = $this->get(route('services.show', $service));

        $response->assertOk();
        $response->assertJsonStructure([]);
    }


    #[Test]
    public function update_uses_form_request_validation(): void
    {
        $this->assertActionUsesFormRequest(
            \App\Http\Controllers\Service\ServiceController::class,
            'update',
            \App\Http\Requests\Service\ServiceUpdateRequest::class
        );
    }

    #[Test]
    public function update_behaves_as_expected(): void
    {
        $service = Service::factory()->create();
        $name = fake()->name();
        $duration = fake()->numberBetween(-10000, 10000);
        $capacity_per_slot = fake()->numberBetween(-10000, 10000);
        $is_active = fake()->boolean();
        $is_emergency = fake()->boolean();
        $created_by = fake()->numberBetween(-10000, 10000);

        $response = $this->put(route('services.update', $service), [
            'name' => $name,
            'duration' => $duration,
            'capacity_per_slot' => $capacity_per_slot,
            'is_active' => $is_active,
            'is_emergency' => $is_emergency,
            'created_by' => $created_by,
        ]);

        $service->refresh();

        $response->assertOk();
        $response->assertJsonStructure([]);

        $this->assertEquals($name, $service->name);
        $this->assertEquals($duration, $service->duration);
        $this->assertEquals($capacity_per_slot, $service->capacity_per_slot);
        $this->assertEquals($is_active, $service->is_active);
        $this->assertEquals($is_emergency, $service->is_emergency);
        $this->assertEquals($created_by, $service->created_by);
    }


    #[Test]
    public function destroy_deletes_and_responds_with(): void
    {
        $service = Service::factory()->create();

        $response = $this->delete(route('services.destroy', $service));

        $response->assertNoContent();

        $this->assertModelMissing($service);
    }
}
