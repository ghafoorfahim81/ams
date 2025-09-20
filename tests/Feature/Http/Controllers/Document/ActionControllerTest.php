<?php

namespace Tests\Feature\Http\Controllers\Document;

use App\Models\Action;
use App\Models\CreatedBy;
use App\Models\Document;
use App\Models\UpdatedBy;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use JMac\Testing\Traits\AdditionalAssertions;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

/**
 * @see \App\Http\Controllers\Document\ActionController
 */
final class ActionControllerTest extends TestCase
{
    use AdditionalAssertions, RefreshDatabase, WithFaker;

    #[Test]
    public function index_behaves_as_expected(): void
    {
        Action::factory()->count(3)->create();

        $response = $this->get(route('actions.index'));

        $response->assertOk();
        $response->assertJsonStructure([]);
    }

    #[Test]
    public function store_uses_form_request_validation(): void
    {
        $this->assertActionUsesFormRequest(
            \App\Http\Controllers\Document\ActionController::class,
            'store',
            \App\Http\Requests\Document\ActionStoreRequest::class
        );
    }

    #[Test]
    public function store_saves(): void
    {
        $document = Document::factory()->create();
        $created_by = CreatedBy::factory()->create();
        $updated_by = UpdatedBy::factory()->create();

        $response = $this->post(route('actions.store'), [
            'document_id' => $document->id,
            'created_by' => $created_by->id,
            'updated_by' => $updated_by->id,
        ]);

        $actions = Action::query()
            ->where('document_id', $document->id)
            ->where('created_by', $created_by->id)
            ->where('updated_by', $updated_by->id)
            ->get();
        $this->assertCount(1, $actions);
        $actions->first();

        $response->assertCreated();
        $response->assertJsonStructure([]);
    }

    #[Test]
    public function show_behaves_as_expected(): void
    {
        $action = Action::factory()->create();

        $response = $this->get(route('actions.show', $action));

        $response->assertOk();
        $response->assertJsonStructure([]);
    }

    #[Test]
    public function update_uses_form_request_validation(): void
    {
        $this->assertActionUsesFormRequest(
            \App\Http\Controllers\Document\ActionController::class,
            'update',
            \App\Http\Requests\Document\ActionUpdateRequest::class
        );
    }

    #[Test]
    public function update_behaves_as_expected(): void
    {
        $action = Action::factory()->create();
        $document = Document::factory()->create();
        $created_by = CreatedBy::factory()->create();
        $updated_by = UpdatedBy::factory()->create();

        $response = $this->put(route('actions.update', $action), [
            'document_id' => $document->id,
            'created_by' => $created_by->id,
            'updated_by' => $updated_by->id,
        ]);

        $action->refresh();

        $response->assertOk();
        $response->assertJsonStructure([]);

        $this->assertEquals($document->id, $action->document_id);
        $this->assertEquals($created_by->id, $action->created_by);
        $this->assertEquals($updated_by->id, $action->updated_by);
    }

    #[Test]
    public function destroy_deletes_and_responds_with(): void
    {
        $action = Action::factory()->create();

        $response = $this->delete(route('actions.destroy', $action));

        $response->assertNoContent();

        $this->assertModelMissing($action);
    }

    #[Test]
    public function requests_behaves_as_expected(): void
    {
        $this->get(route('actions.requests'));
    }
}
