<?php

namespace Tests\Unit;

use App\Models\Certification;
use App\Models\Chapter;
use App\Models\Question;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ChapterTest extends TestCase
{
    use RefreshDatabase;

    public function test_chapter_belongs_to_certification()
    {
        $certification = Certification::factory()->create();
        $chapter = Chapter::factory()->create(['certification_id' => $certification->id]);

        $this->assertInstanceOf(Certification::class, $chapter->certification);
        $this->assertEquals($certification->id, $chapter->certification->id);
    }

    public function test_chapter_has_many_questions()
    {
        $chapter = Chapter::factory()->create();
        $question1 = Question::factory()->create(['chapter_id' => $chapter->id]);
        $question2 = Question::factory()->create(['chapter_id' => $chapter->id]);

        $this->assertCount(2, $chapter->questions);
        $this->assertTrue($chapter->questions->contains($question1));
        $this->assertTrue($chapter->questions->contains($question2));
    }

    public function test_chapter_questions_count_attribute()
    {
        $chapter = Chapter::factory()->create();
        Question::factory()->count(3)->create(['chapter_id' => $chapter->id]);

        $this->assertEquals(3, $chapter->questions_count);
    }

    public function test_chapter_fillable_attributes()
    {
        $data = [
            'certification_id' => Certification::factory()->create()->id,
            'name' => 'Test Chapter',
            'description' => 'Test Description',
            'order' => 1,
        ];

        $chapter = Chapter::create($data);

        $this->assertEquals($data['certification_id'], $chapter->certification_id);
        $this->assertEquals($data['name'], $chapter->name);
        $this->assertEquals($data['description'], $chapter->description);
        $this->assertEquals($data['order'], $chapter->order);
    }

    public function test_chapter_order_is_cast_to_integer()
    {
        $chapter = Chapter::factory()->create(['order' => '5']);

        $this->assertIsInt($chapter->order);
        $this->assertEquals(5, $chapter->order);
    }

    public function test_chapter_description_can_be_null()
    {
        $chapter = Chapter::factory()->create(['description' => null]);

        $this->assertNull($chapter->description);
    }
}