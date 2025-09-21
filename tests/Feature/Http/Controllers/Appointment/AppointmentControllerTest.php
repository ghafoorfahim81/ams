<?php

namespace Tests\Feature\Http\Controllers\Appointment;

use App\Models\Appointment;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Support\Carbon;
use JMac\Testing\Traits\AdditionalAssertions;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

/**
 * @see \App\Http\Controllers\Appointment\AppointmentController
 */
final class AppointmentControllerTest extends TestCase
{
    use AdditionalAssertions, RefreshDatabase, WithFaker;

    #[Test]
    public function index_behaves_as_expected(): void
    {
        $appointments = Appointment::factory()->count(3)->create();

        $response = $this->get(route('appointments.index'));

        $response->assertOk();
        $response->assertJsonStructure([]);
    }


    #[Test]
    public function store_uses_form_request_validation(): void
    {
        $this->assertActionUsesFormRequest(
            \App\Http\Controllers\Appointment\AppointmentController::class,
            'store',
            \App\Http\Requests\Appointment\AppointmentStoreRequest::class
        );
    }

    #[Test]
    public function store_saves(): void
    {
        $code = fake()->word();
        $service_id = fake()->numberBetween(-10000, 10000);
        $booked_by_user_id = fake()->numberBetween(-10000, 10000);
        $type = fake()->word();
        $status = fake()->word();
        $scheduled_date = Carbon::parse(fake()->dateTime());
        $start_time = fake()->time();
        $end_time = fake()->time();
        $created_by = fake()->numberBetween(-10000, 10000);

        $response = $this->post(route('appointments.store'), [
            'code' => $code,
            'service_id' => $service_id,
            'booked_by_user_id' => $booked_by_user_id,
            'type' => $type,
            'status' => $status,
            'scheduled_date' => $scheduled_date->toDateTimeString(),
            'start_time' => $start_time,
            'end_time' => $end_time,
            'created_by' => $created_by,
        ]);

        $appointments = Appointment::query()
            ->where('code', $code)
            ->where('service_id', $service_id)
            ->where('booked_by_user_id', $booked_by_user_id)
            ->where('type', $type)
            ->where('status', $status)
            ->where('scheduled_date', $scheduled_date)
            ->where('start_time', $start_time)
            ->where('end_time', $end_time)
            ->where('created_by', $created_by)
            ->get();
        $this->assertCount(1, $appointments);
        $appointment = $appointments->first();

        $response->assertCreated();
        $response->assertJsonStructure([]);
    }


    #[Test]
    public function show_behaves_as_expected(): void
    {
        $appointment = Appointment::factory()->create();

        $response = $this->get(route('appointments.show', $appointment));

        $response->assertOk();
        $response->assertJsonStructure([]);
    }


    #[Test]
    public function update_uses_form_request_validation(): void
    {
        $this->assertActionUsesFormRequest(
            \App\Http\Controllers\Appointment\AppointmentController::class,
            'update',
            \App\Http\Requests\Appointment\AppointmentUpdateRequest::class
        );
    }

    #[Test]
    public function update_behaves_as_expected(): void
    {
        $appointment = Appointment::factory()->create();
        $code = fake()->word();
        $service_id = fake()->numberBetween(-10000, 10000);
        $booked_by_user_id = fake()->numberBetween(-10000, 10000);
        $type = fake()->word();
        $status = fake()->word();
        $scheduled_date = Carbon::parse(fake()->dateTime());
        $start_time = fake()->time();
        $end_time = fake()->time();
        $created_by = fake()->numberBetween(-10000, 10000);

        $response = $this->put(route('appointments.update', $appointment), [
            'code' => $code,
            'service_id' => $service_id,
            'booked_by_user_id' => $booked_by_user_id,
            'type' => $type,
            'status' => $status,
            'scheduled_date' => $scheduled_date->toDateTimeString(),
            'start_time' => $start_time,
            'end_time' => $end_time,
            'created_by' => $created_by,
        ]);

        $appointment->refresh();

        $response->assertOk();
        $response->assertJsonStructure([]);

        $this->assertEquals($code, $appointment->code);
        $this->assertEquals($service_id, $appointment->service_id);
        $this->assertEquals($booked_by_user_id, $appointment->booked_by_user_id);
        $this->assertEquals($type, $appointment->type);
        $this->assertEquals($status, $appointment->status);
        $this->assertEquals($scheduled_date, $appointment->scheduled_date);
        $this->assertEquals($start_time, $appointment->start_time);
        $this->assertEquals($end_time, $appointment->end_time);
        $this->assertEquals($created_by, $appointment->created_by);
    }


    #[Test]
    public function destroy_deletes_and_responds_with(): void
    {
        $appointment = Appointment::factory()->create();

        $response = $this->delete(route('appointments.destroy', $appointment));

        $response->assertNoContent();

        $this->assertModelMissing($appointment);
    }
}
