<?php

namespace Tests\Feature;

use App\Models\Certification;
use App\Models\Chapter;
use App\Models\Question;
use Database\Seeders\ChapterSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ChapterSeederTest extends TestCase
{
    use RefreshDatabase;

    public function test_chapter_seeder_creates_chapters_and_questions(): void
    {
        // Create a certification first
        $certification = Certification::factory()->create();

        // Run the seeder
        $seeder = new ChapterSeeder();
        $seeder->run();

        // Assert chapters were created
        $this->assertGreaterThan(0, Chapter::count());
        
        // Assert questions were created
        $this->assertGreaterThan(0, Question::whereNotNull('chapter_id')->count());

        // Assert chapters have proper structure
        $chapters = Chapter::where('certification_id', $certification->id)->get();
        $this->assertCount(5, $chapters); // Should create 5 chapters per certification

        // Assert chapters are properly ordered
        $orders = $chapters->pluck('order')->sort()->values();
        $this->assertEquals([1, 2, 3, 4, 5], $orders->toArray());

        // Assert each chapter has questions
        foreach ($chapters as $chapter) {
            $this->assertGreaterThan(0, $chapter->questions()->count());
        }
    }

    public function test_seeder_creates_realistic_question_distribution(): void
    {
        $certification = Certification::factory()->create();
        
        $seeder = new ChapterSeeder();
        $seeder->run();

        $questions = Question::whereHas('chapter', function ($query) use ($certification) {
            $query->where('certification_id', $certification->id);
        })->get();

        // Assert we have questions with different difficulties
        $difficulties = $questions->pluck('difficulty')->unique();
        $this->assertContains('easy', $difficulties);
        $this->assertContains('medium', $difficulties);
        $this->assertContains('hard', $difficulties);

        // Assert we have questions with different answer patterns (single vs multiple correct)
        $singleChoiceQuestions = $questions->filter(function ($question) {
            return collect($question->answers)->where('correct', true)->count() === 1;
        });
        $multipleChoiceQuestions = $questions->filter(function ($question) {
            return collect($question->answers)->where('correct', true)->count() > 1;
        });
        
        $this->assertGreaterThan(0, $singleChoiceQuestions->count());
        $this->assertGreaterThan(0, $multipleChoiceQuestions->count());

        // Assert points are assigned based on difficulty
        $easyQuestions = $questions->where('difficulty', 'easy');
        $hardQuestions = $questions->where('difficulty', 'hard');
        
        if ($easyQuestions->isNotEmpty() && $hardQuestions->isNotEmpty()) {
            $avgEasyPoints = $easyQuestions->avg('points');
            $avgHardPoints = $hardQuestions->avg('points');
            $this->assertLessThan($avgHardPoints, $avgEasyPoints);
        }
    }

    public function test_seeder_works_with_existing_certifications(): void
    {
        // Create multiple certifications
        $certifications = Certification::factory(3)->create();

        $seeder = new ChapterSeeder();
        $seeder->run();

        // Assert chapters were created for all certifications
        foreach ($certifications as $certification) {
            $chapters = Chapter::where('certification_id', $certification->id)->get();
            $this->assertCount(5, $chapters);
            
            // Assert each chapter has questions
            foreach ($chapters as $chapter) {
                $this->assertGreaterThan(0, $chapter->questions()->count());
            }
        }
    }

    public function test_seeder_creates_certifications_if_none_exist(): void
    {
        // Ensure no certifications exist
        $this->assertEquals(0, Certification::count());

        $seeder = new ChapterSeeder();
        $seeder->run();

        // Assert certifications were created
        $this->assertGreaterThan(0, Certification::count());
        
        // Assert chapters and questions were created
        $this->assertGreaterThan(0, Chapter::count());
        $this->assertGreaterThan(0, Question::whereNotNull('chapter_id')->count());
    }
}