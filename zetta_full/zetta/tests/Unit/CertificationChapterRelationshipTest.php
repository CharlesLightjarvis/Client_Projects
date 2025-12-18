<?php

namespace Tests\Unit;

use App\Models\Certification;
use App\Models\Chapter;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CertificationChapterRelationshipTest extends TestCase
{
    use RefreshDatabase;

    public function test_certification_has_many_chapters()
    {
        $certification = Certification::factory()->create();
        $chapter1 = Chapter::factory()->create([
            'certification_id' => $certification->id,
            'order' => 1
        ]);
        $chapter2 = Chapter::factory()->create([
            'certification_id' => $certification->id,
            'order' => 2
        ]);

        $this->assertCount(2, $certification->chapters);
        $this->assertTrue($certification->chapters->contains($chapter1));
        $this->assertTrue($certification->chapters->contains($chapter2));
    }

    public function test_certification_chapters_are_ordered_by_order_field()
    {
        $certification = Certification::factory()->create();
        $chapter3 = Chapter::factory()->create([
            'certification_id' => $certification->id,
            'order' => 3
        ]);
        $chapter1 = Chapter::factory()->create([
            'certification_id' => $certification->id,
            'order' => 1
        ]);
        $chapter2 = Chapter::factory()->create([
            'certification_id' => $certification->id,
            'order' => 2
        ]);

        $chapters = $certification->chapters;
        
        $this->assertEquals($chapter1->id, $chapters[0]->id);
        $this->assertEquals($chapter2->id, $chapters[1]->id);
        $this->assertEquals($chapter3->id, $chapters[2]->id);
    }

    public function test_deleting_certification_deletes_chapters()
    {
        $certification = Certification::factory()->create();
        $chapter = Chapter::factory()->create(['certification_id' => $certification->id]);

        $this->assertDatabaseHas('chapters', ['id' => $chapter->id]);

        $certification->delete();

        $this->assertDatabaseMissing('chapters', ['id' => $chapter->id]);
    }
}