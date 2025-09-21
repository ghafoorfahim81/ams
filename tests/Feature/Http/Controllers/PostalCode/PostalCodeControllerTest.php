<?php

namespace Tests\Feature\Http\Controllers\PostalCode;

use App\Models\PostalCode;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use JMac\Testing\Traits\AdditionalAssertions;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

/**
 * @see \App\Http\Controllers\PostalCode\PostalCodeController
 */
final class PostalCodeControllerTest extends TestCase
{
    use AdditionalAssertions, RefreshDatabase, WithFaker;

    #[Test]
    public function index_behaves_as_expected(): void
    {
        $postalCodes = PostalCode::factory()->count(3)->create();

        $response = $this->get(route('postal-codes.index'));

        $response->assertOk();
        $response->assertJsonStructure([]);
    }


    #[Test]
    public function store_uses_form_request_validation(): void
    {
        $this->assertActionUsesFormRequest(
            \App\Http\Controllers\PostalCode\PostalCodeController::class,
            'store',
            \App\Http\Requests\PostalCode\PostalCodeStoreRequest::class
        );
    }

    #[Test]
    public function store_saves(): void
    {
        $code = fake()->word();
        $is_permitted = fake()->boolean();

        $response = $this->post(route('postal-codes.store'), [
            'code' => $code,
            'is_permitted' => $is_permitted,
        ]);

        $postalCodes = PostalCode::query()
            ->where('code', $code)
            ->where('is_permitted', $is_permitted)
            ->get();
        $this->assertCount(1, $postalCodes);
        $postalCode = $postalCodes->first();

        $response->assertCreated();
        $response->assertJsonStructure([]);
    }


    #[Test]
    public function show_behaves_as_expected(): void
    {
        $postalCode = PostalCode::factory()->create();

        $response = $this->get(route('postal-codes.show', $postalCode));

        $response->assertOk();
        $response->assertJsonStructure([]);
    }


    #[Test]
    public function update_uses_form_request_validation(): void
    {
        $this->assertActionUsesFormRequest(
            \App\Http\Controllers\PostalCode\PostalCodeController::class,
            'update',
            \App\Http\Requests\PostalCode\PostalCodeUpdateRequest::class
        );
    }

    #[Test]
    public function update_behaves_as_expected(): void
    {
        $postalCode = PostalCode::factory()->create();
        $code = fake()->word();
        $is_permitted = fake()->boolean();

        $response = $this->put(route('postal-codes.update', $postalCode), [
            'code' => $code,
            'is_permitted' => $is_permitted,
        ]);

        $postalCode->refresh();

        $response->assertOk();
        $response->assertJsonStructure([]);

        $this->assertEquals($code, $postalCode->code);
        $this->assertEquals($is_permitted, $postalCode->is_permitted);
    }


    #[Test]
    public function destroy_deletes_and_responds_with(): void
    {
        $postalCode = PostalCode::factory()->create();

        $response = $this->delete(route('postal-codes.destroy', $postalCode));

        $response->assertNoContent();

        $this->assertModelMissing($postalCode);
    }
}
