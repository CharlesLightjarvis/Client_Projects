<?php

namespace Tests\Unit;

use App\Models\Certification;
use App\Models\Chapter;
use App\Models\QuizConfiguration;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class QuizConfigurationTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
    }

    public function test_quiz_configuration_can_be_created_with_chapter_distribution()
    {
        $certification = Certification::factory()->create();
        $chapter1 = Chapter::factory()->create(['certification_id' => $certification->id]);
        $chapter2 = Chapter::factory()->create(['certification_id' => $certification->id]);

        $config = QuizConfiguration::create([
            'configurable_type' => Certification::class,
            'configurable_id' => $certification->id,
            'total_questions' => 15,
            'chapter_distribution' => [
                $chapter1->id => 10,
                $chapter2->id => 5,
            ],
            'difficulty_distribution' => [
                'easy' => 40,
                'medium' => 40,
                'hard' => 20,
            ],
            'passing_score' => 70,
            'time_limit' => 60,
        ]);

        $this->assertInstanceOf(QuizConfiguration::class, $config);
        $this->assertEquals(15, $config->total_questions);
        $this->assertIsArray($config->chapter_distribution);
        $this->assertEquals(10, $config->chapter_distribution[$chapter1->id]);
        $this->assertEquals(5, $config->chapter_distribution[$chapter2->id]);
    }

    public function test_chapter_distribution_is_cast_to_array()
    {
        $certification = Certification::factory()->create();
        $chapter = Chapter::factory()->create(['certification_id' => $certification->id]);

        $config = QuizConfiguration::create([
            'configurable_type' => Certification::class,
            'configurable_id' => $certification->id,
            'total_questions' => 10,
            'chapter_distribution' => [$chapter->id => 10],
            'difficulty_distribution' => ['easy' => 100],
            'passing_score' => 70,
            'time_limit' => 60,
        ]);

        $this->assertIsArray($config->chapter_distribution);
        $this->assertEquals(10, $config->chapter_distribution[$chapter->id]);
    }

    public function test_get_total_questions_from_chapters()
    {
        $certification = Certification::factory()->create();
        $chapter1 = Chapter::factory()->create(['certification_id' => $certification->id]);
        $chapter2 = Chapter::factory()->create(['certification_id' => $certification->id]);

        $config = QuizConfiguration::create([
            'configurable_type' => Certification::class,
            'configurable_id' => $certification->id,
            'total_questions' => 15,
            'chapter_distribution' => [
                $chapter1->id => 10,
                $chapter2->id => 5,
            ],
            'difficulty_distribution' => ['easy' => 100],
            'passing_score' => 70,
            'time_limit' => 60,
        ]);

        $this->assertEquals(15, $config->getTotalQuestionsFromChapters());
    }

    public function test_get_total_questions_from_chapters_returns_zero_when_no_distribution()
    {
        $certification = Certification::factory()->create();

        $config = QuizConfiguration::create([
            'configurable_type' => Certification::class,
            'configurable_id' => $certification->id,
            'total_questions' => 10,
            'difficulty_distribution' => ['easy' => 100],
            'passing_score' => 70,
            'time_limit' => 60,
        ]);

        $this->assertEquals(0, $config->getTotalQuestionsFromChapters());
    }

    public function test_has_chapter_distribution()
    {
        $certification = Certification::factory()->create();
        $chapter = Chapter::factory()->create(['certification_id' => $certification->id]);

        $configWithDistribution = QuizConfiguration::create([
            'configurable_type' => Certification::class,
            'configurable_id' => $certification->id,
            'total_questions' => 10,
            'chapter_distribution' => [$chapter->id => 10],
            'difficulty_distribution' => ['easy' => 100],
            'passing_score' => 70,
            'time_limit' => 60,
        ]);

        $configWithoutDistribution = QuizConfiguration::create([
            'configurable_type' => Certification::class,
            'configurable_id' => $certification->id,
            'total_questions' => 10,
            'difficulty_distribution' => ['easy' => 100],
            'passing_score' => 70,
            'time_limit' => 60,
        ]);

        $this->assertTrue($configWithDistribution->hasChapterDistribution());
        $this->assertFalse($configWithoutDistribution->hasChapterDistribution());
    }

    public function test_get_questions_for_chapter()
    {
        $certification = Certification::factory()->create();
        $chapter1 = Chapter::factory()->create(['certification_id' => $certification->id]);
        $chapter2 = Chapter::factory()->create(['certification_id' => $certification->id]);

        $config = QuizConfiguration::create([
            'configurable_type' => Certification::class,
            'configurable_id' => $certification->id,
            'total_questions' => 15,
            'chapter_distribution' => [
                $chapter1->id => 10,
                $chapter2->id => 5,
            ],
            'difficulty_distribution' => ['easy' => 100],
            'passing_score' => 70,
            'time_limit' => 60,
        ]);

        $this->assertEquals(10, $config->getQuestionsForChapter($chapter1->id));
        $this->assertEquals(5, $config->getQuestionsForChapter($chapter2->id));
        $this->assertEquals(0, $config->getQuestionsForChapter('non-existent-id'));
    }

    public function test_configurable_relationship()
    {
        $certification = Certification::factory()->create();

        $config = QuizConfiguration::create([
            'configurable_type' => Certification::class,
            'configurable_id' => $certification->id,
            'total_questions' => 10,
            'difficulty_distribution' => ['easy' => 100],
            'passing_score' => 70,
            'time_limit' => 60,
        ]);

        $this->assertInstanceOf(Certification::class, $config->configurable);
        $this->assertEquals($certification->id, $config->configurable->id);
    }
}