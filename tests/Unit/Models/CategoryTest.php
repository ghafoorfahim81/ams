<?php

namespace Tests\Unit\Models;

use App\Models\Administration\Category;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CategoryTest extends TestCase
{
    use RefreshDatabase;

    public function test_to_array(): void
    {
        $category = Category::factory()->create()->fresh();

        $this->assertEquals(array_keys($category->toArray()), [
            'id',
            'name_fa',
            'name_ps',
            'name_en',
            'parent_id',
            'created_at',
            'updated_at',
        ]);
    }

    public function test_belong_to_parent(): void
    {
        $parent = Category::factory()->create()->fresh();

        $category = Category::factory()->create()->fresh();

        $category->parent()->associate($parent);

        $this->assertInstanceOf(Category::class, $category->parent);
    }

    public function test_has_many_children(): void
    {

        $category = Category::factory()->hasChildren(3)->create();

        $this->assertCount(3, $category->children);
    }
}
