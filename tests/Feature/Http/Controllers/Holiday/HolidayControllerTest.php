<?php

namespace Tests\Feature\Http\Controllers\Holiday;

use App\Models\Holiday;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Support\Carbon;
use JMac\Testing\Traits\AdditionalAssertions;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

/**
 * @see \App\Http\Controllers\Holiday\HolidayController
 */
final class HolidayControllerTest extends TestCase
{
    use AdditionalAssertions, RefreshDatabase, WithFaker;

    #[Test]
    public function index_behaves_as_expected(): void
    {
        $holidays = Holiday::factory()->count(3)->create();

        $response = $this->get(route('holidays.index'));

        $response->assertOk();
        $response->assertJsonStructure([]);
    }


    #[Test]
    public function store_uses_form_request_validation(): void
    {
        $this->assertActionUsesFormRequest(
            \App\Http\Controllers\Holiday\HolidayController::class,
            'store',
            \App\Http\Requests\Holiday\HolidayStoreRequest::class
        );
    }

    #[Test]
    public function store_saves(): void
    {
        $date = Carbon::parse(fake()->date());

        $response = $this->post(route('holidays.store'), [
            'date' => $date->toDateString(),
        ]);

        $holidays = Holiday::query()
            ->where('date', $date)
            ->get();
        $this->assertCount(1, $holidays);
        $holiday = $holidays->first();

        $response->assertCreated();
        $response->assertJsonStructure([]);
    }


    #[Test]
    public function show_behaves_as_expected(): void
    {
        $holiday = Holiday::factory()->create();

        $response = $this->get(route('holidays.show', $holiday));

        $response->assertOk();
        $response->assertJsonStructure([]);
    }


    #[Test]
    public function update_uses_form_request_validation(): void
    {
        $this->assertActionUsesFormRequest(
            \App\Http\Controllers\Holiday\HolidayController::class,
            'update',
            \App\Http\Requests\Holiday\HolidayUpdateRequest::class
        );
    }

    #[Test]
    public function update_behaves_as_expected(): void
    {
        $holiday = Holiday::factory()->create();
        $date = Carbon::parse(fake()->date());

        $response = $this->put(route('holidays.update', $holiday), [
            'date' => $date->toDateString(),
        ]);

        $holiday->refresh();

        $response->assertOk();
        $response->assertJsonStructure([]);

        $this->assertEquals($date, $holiday->date);
    }


    #[Test]
    public function destroy_deletes_and_responds_with(): void
    {
        $holiday = Holiday::factory()->create();

        $response = $this->delete(route('holidays.destroy', $holiday));

        $response->assertNoContent();

        $this->assertModelMissing($holiday);
    }
}
