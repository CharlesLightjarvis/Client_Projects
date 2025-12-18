<?php

namespace Tests\Unit;

use App\Models\Certification;
use App\Models\Chapter;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ChapterFactoryTest extends TestCase
{
    use RefreshDatabase;

    public function test_chapter_factory_creates_basic_chapter(): void
    {
        $chapter = Chapter::factory()->create();

        $this->assertInstanceOf(Chapter::class, $chapter);
        $this->assertNotNull($chapter->certification_id);
        $this->assertNotNull($chapter->name);
        $this->assertNotNull($chapter->order);
    }

    public function test_chapter_factory_without_description(): void
    {
        $chapter = Chapter::factory()->withoutDescription()->create();

        $this->assertNull($chapter->description);
    }

    public function test_chapter_factory_with_specific_order(): void
    {
        $chapter = Chapter::factory()->withOrder(5)->create();

        $this->assertEquals(5, $chapter->order);
    }

    public function test_chapter_factory_for_specific_certification(): void
    {
        $certification = Certification::factory()->create();
        $chapter = Chapter::factory()->forCertification($certification->id)->create();

        $this->assertEquals($certification->id, $chapter->certification_id);
    }

    public function test_chapter_factory_exam_focused(): void
    {
        $chapter = Chapter::factory()->examFocused()->create();

        $examTopics = [
            'Fundamentals and Core Concepts',
            'Security and Best Practices', 
            'Implementation and Configuration',
            'Troubleshooting and Maintenance',
            'Advanced Topics and Integration'
        ];

        $this->assertContains($chapter->name, $examTopics);
        $this->assertNotNull($chapter->description);
    }

    public function test_chapter_factory_sequential_order(): void
    {
        $certification = Certification::factory()->create();
        
        $chapters = Chapter::factory()
            ->forCertification($certification->id)
            ->sequentialOrder()
            ->count(3)
            ->create();

        $orders = $chapters->pluck('order')->sort()->values();
        $this->assertEquals([1, 2, 3], $orders->toArray());
    }

    public function test_chapter_factory_sequential_order_with_start_order(): void
    {
        $certification = Certification::factory()->create();
        
        $chapters = Chapter::factory()
            ->forCertification($certification->id)
            ->sequentialOrder(5)
            ->count(3)
            ->create();

        $orders = $chapters->pluck('order')->sort()->values();
        $this->assertEquals([5, 6, 7], $orders->toArray());
    }
}