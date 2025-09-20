<?php

namespace Tests\Feature\Http\Controllers;

use App\Models\Administration\Category;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Testing\Fluent\AssertableJson;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

/**
 * @see \App\Http\Controllers\CategoryController
 */
final class CategoryControllerTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    protected function setUp(): void
    {
        parent::setUp();

        $this->authenticateUser();
    }

    public function test_authenticated_users_can_access_categories_index(): void
    {
        $this->get(route('categories.index'))
            ->assertStatus(200);

        $this->assertAuthenticated();
    }

    public function test_return_all_categories(): void
    {
        $categories = Category::factory(4)->create();

        $firstCategory = $categories->first();

        $this->get(route('categories.index'))
            ->assertInertia(fn (Assert $page): \Illuminate\Testing\Fluent\AssertableJson => $page
                ->component('Categories/Index')
                ->has('categories.data', 4, fn (Assert $category): \Illuminate\Testing\Fluent\AssertableJson => $category
                    ->where('id', $firstCategory->id)
                    ->where('name_fa', $firstCategory->name_fa)
                    ->where('name_ps', $firstCategory->name_ps)
                    ->where('name_en', $firstCategory->name_en)
                    ->where('parent_id', $firstCategory->parent_id)
                )
            );
    }

    public function test_show_create_page(): void
    {

        $this->get(route('categories.create'))
            ->assertInertia(fn (Assert $page): \Inertia\Testing\AssertableInertia => $page
                ->component('Categories/Create')
            );
    }

    public function test_it_throw_model_not_found_exception_for_non_existing_record_on_show(): void
    {
        $this->get(route('categories.show', 99999))
            ->assertStatus(404);
    }

    public function test_store_category(): void
    {

        $category = [
            'name_fa' => $this->faker->word(),
            'name_ps' => $this->faker->word(),
            'name_en' => $this->faker->word(),
            'parent_id' => null,
        ];

        $this->postJson(route('categories.store', $category))
            ->assertJson(fn (AssertableJson $json): \Illuminate\Testing\Fluent\AssertableJson => $json
                ->has('data.id')
                ->where('data.name_fa', $category['name_fa'])
                ->where('data.name_ps', $category['name_ps'])
                ->where('data.name_en', $category['name_en'])
                ->where('data.parent_id', $category['parent_id'])
            );
    }

    public function test_validation_fails_when_required_fields_are_missing(): void
    {

        $response = $this->postJson('/categories', []);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['name_fa', 'name_ps', 'name_en']);
    }

    public function test_validation_fails_for_non_string_names(): void
    {

        $response = $this->postJson('/categories', [
            'name_fa' => 123,
            'name_ps' => 123,
            'name_en' => 123,
        ]);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['name_fa', 'name_ps', 'name_en']);
    }

    public function test_validation_fails_when_name_is_not_unique(): void
    {

        $attributes = [
            'name_fa' => 'Existing Name',
            'name_ps' => 'Existing Name',
            'name_en' => 'Existing Name',
        ];

        Category::create($attributes);

        $response = $this->postJson('/categories', $attributes);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['name_fa', 'name_ps', 'name_en']);
    }

    public function test_validation_passes_for_valid_parent_id(): void
    {

        $parentCategory = Category::create([
            'name_fa' => 'Parent',
            'name_ps' => 'Parent',
            'name_en' => 'Parent',
        ]);

        $response = $this->postJson('/categories', [
            'name_fa' => 'New Category',
            'name_ps' => 'New Category',
            'name_en' => 'New Category',
            'parent_id' => $parentCategory->id,
        ]);

        $response->assertStatus(201);
    }

    public function test_validation_fails_for_invalid_parent_id(): void
    {

        $response = $this->postJson('/categories', [
            'name_fa' => 'New Category',
            'name_ps' => 'New Category',
            'name_en' => 'New Category',
            'parent_id' => 99999,
        ]);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['parent_id']);
    }

    public function test_show_edit_page(): void
    {
        $category = Category::factory()->create();

        $this->get(route('categories.edit', $category))
            ->assertInertia(fn (Assert $page): \Inertia\Testing\AssertableInertia => $page
                ->component('Categories/Edit')
                ->has('category')
                ->where('category.data.id', $category->id)
                ->where('category.data.name_fa', $category->name_fa)
                ->where('category.data.name_ps', $category->name_ps)
                ->where('category.data.name_en', $category->name_en)
                ->where('category.data.parent_id', $category->parent_id)
            );
    }

    public function test_update_category(): void
    {
        $category = Category::factory()->create();

        $newCategory = [
            'name_fa' => $this->faker->word(),
            'name_ps' => $this->faker->word(),
            'name_en' => $this->faker->word(),
            'parent_id' => null,
        ];

        $this->putJson(route('categories.update', $category), $newCategory)
            ->assertJson(fn (AssertableJson $json): AssertableJson => $json
                ->has('data.id')
                ->where('data.name_fa', $newCategory['name_fa'])
                ->where('data.name_ps', $newCategory['name_ps'])
                ->where('data.name_en', $newCategory['name_en'])
                ->where('data.parent_id', $newCategory['parent_id'])
            );
    }

    public function test_it_throw_model_not_found_exception_for_non_existing_record_on_update(): void
    {
        $this->delete(route('categories.update', 99999), [])
            ->assertStatus(404);
    }

    public function test_validation_fails_when_required_fields_are_missing_on_update(): void
    {
        $category = Category::factory()->create();

        $response = $this->putJson(route('categories.update', $category), []);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['name_fa', 'name_ps', 'name_en']);
    }

    public function test_validation_fails_when_name_is_not_unique_on_update(): void
    {

        $attributes1 = [
            'name_fa' => 'Existing Name1',
            'name_ps' => 'Existing Name1',
            'name_en' => 'Existing Name1',
        ];

        $attributes2 = [
            'name_fa' => 'Existing Name2',
            'name_ps' => 'Existing Name2',
            'name_en' => 'Existing Name2',
        ];

        Category::create($attributes1);

        $category2 = Category::create($attributes2);

        $response = $this->putJson(route('categories.update', $category2), $attributes1);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['name_fa', 'name_ps', 'name_en']);
    }

    public function test_validation_should_ignore_the_current_record_on_update(): void
    {

        $category = Category::factory()->create();

        $response = $this->putJson(route('categories.update', $category), [
            'name_fa' => $category->name_fa,
            'name_ps' => $category->name_ps,
            'name_en' => $category->name_en,
        ]);

        $response->assertStatus(200);

    }

    public function test_delete_category(): void
    {
        $category = Category::factory()->create();

        $this->delete(route('categories.destroy', $category))
            ->assertNoContent();

        $this->assertDatabaseMissing('categories', ['id' => $category->id]);
    }

    public function test_it_throw_model_not_found_exception_for_non_existing_record_on_delete(): void
    {
        $this->delete(route('categories.destroy', 99999))
            ->assertStatus(404);
    }

    public function authenticateUser()
    {
        /** @var \Illuminate\Contracts\Auth\Authenticatable $user */
        $user = User::factory()->create();
        $this->actingAs($user);

        return $user;
    }
}
