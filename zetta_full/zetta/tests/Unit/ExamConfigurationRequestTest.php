<?php

namespace Tests\Unit;

use App\Http\Requests\ExamConfigurationRequest;
use App\Models\Certification;
use App\Models\Chapter;
use App\Models\Question;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Validator;
use Tests\TestCase;

class ExamConfigurationRequestTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
    }

    public function test_validates_required_fields()
    {
        $request = new ExamConfigurationRequest();
        $validator = Validator::make([], $request->rules());

        $this->assertFalse($validator->passes());
        $this->assertArrayHasKey('total_questions', $validator->errors()->toArray());
        $this->assertArrayHasKey('chapter_distribution', $validator->errors()->toArray());
        $this->assertArrayHasKey('time_limit', $validator->errors()->toArray());
        $this->assertArrayHasKey('passing_score', $validator->errors()->toArray());
    }

    public function test_validates_chapter_distribution_format()
    {
        $request = new ExamConfigurationRequest();
        
        // Test invalid array format
        $validator = Validator::make([
            'total_questions' => 5,
            'chapter_distribution' => 'not_an_array',
            'time_limit' => 60,
            'passing_score' => 70,
        ], $request->rules());

        $this->assertFalse($validator->passes());
        $this->assertArrayHasKey('chapter_distribution', $validator->errors()->toArray());
    }

    public function test_validates_chapter_distribution_values()
    {
        $request = new ExamConfigurationRequest();
        
        // Test invalid question counts
        $validator = Validator::make([
            'total_questions' => 5,
            'chapter_distribution' => [
                'chapter-1' => 0, // Invalid: less than 1
                'chapter-2' => 'not_integer', // Invalid: not integer
            ],
            'time_limit' => 60,
            'passing_score' => 70,
        ], $request->rules());

        $this->assertFalse($validator->passes());
        $errors = $validator->errors()->toArray();
        $this->assertArrayHasKey('chapter_distribution.chapter-1', $errors);
        $this->assertArrayHasKey('chapter_distribution.chapter-2', $errors);
    }

    public function test_validates_time_limit()
    {
        $request = new ExamConfigurationRequest();
        
        // Test invalid time limits
        $testCases = [
            ['time_limit' => 0], // Too low
            ['time_limit' => -1], // Negative
            ['time_limit' => 'not_integer'], // Not integer
        ];

        foreach ($testCases as $data) {
            $validator = Validator::make(array_merge([
                'total_questions' => 5,
                'chapter_distribution' => ['chapter-1' => 5],
                'passing_score' => 70,
            ], $data), $request->rules());

            $this->assertFalse($validator->passes());
            $this->assertArrayHasKey('time_limit', $validator->errors()->toArray());
        }
    }

    public function test_validates_passing_score_range()
    {
        $request = new ExamConfigurationRequest();
        
        // Test invalid passing scores
        $testCases = [
            ['passing_score' => 0], // Too low
            ['passing_score' => 101], // Too high
            ['passing_score' => -1], // Negative
            ['passing_score' => 'not_integer'], // Not integer
        ];

        foreach ($testCases as $data) {
            $validator = Validator::make(array_merge([
                'total_questions' => 5,
                'chapter_distribution' => ['chapter-1' => 5],
                'time_limit' => 60,
            ], $data), $request->rules());

            $this->assertFalse($validator->passes());
            $this->assertArrayHasKey('passing_score', $validator->errors()->toArray());
        }
    }

    public function test_validates_chapter_question_availability()
    {
        // Create test data
        $certification = Certification::factory()->create();
        $chapter = Chapter::factory()->create([
            'certification_id' => $certification->id,
        ]);
        
        // Create only 3 questions for this chapter
        Question::factory()->count(3)->create([
            'chapter_id' => $chapter->id,
        ]);

        $data = [
            'total_questions' => 5,
            'chapter_distribution' => [
                $chapter->id => 5, // Requesting 5 questions but only 3 available
            ],
            'time_limit' => 60,
            'passing_score' => 70,
        ];

        $request = new ExamConfigurationRequest();
        $validator = Validator::make($data, $request->rules());

        // Manually call the custom validation method
        $request->setContainer(app());
        $request->replace($data);
        $request->withValidator($validator);

        $this->assertFalse($validator->passes());
        $errors = $validator->errors()->toArray();
        $this->assertArrayHasKey("chapter_distribution.{$chapter->id}", $errors);
        $this->assertStringContainsString('Only 3 questions available', $errors["chapter_distribution.{$chapter->id}"][0]);
    }

    public function test_validates_nonexistent_chapter()
    {
        $data = [
            'total_questions' => 5,
            'chapter_distribution' => [
                'nonexistent-chapter-id' => 5,
            ],
            'time_limit' => 60,
            'passing_score' => 70,
        ];

        $request = new ExamConfigurationRequest();
        $validator = Validator::make($data, $request->rules());

        // Manually call the custom validation method
        $request->setContainer(app());
        $request->replace($data);
        $request->withValidator($validator);

        $this->assertFalse($validator->passes());
        $errors = $validator->errors()->toArray();
        $this->assertArrayHasKey('chapter_distribution.nonexistent-chapter-id', $errors);
        $this->assertStringContainsString('Chapter not found', $errors['chapter_distribution.nonexistent-chapter-id'][0]);
    }

    public function test_passes_with_valid_data()
    {
        // Create test data
        $certification = Certification::factory()->create();
        $chapter1 = Chapter::factory()->create([
            'certification_id' => $certification->id,
        ]);
        $chapter2 = Chapter::factory()->create([
            'certification_id' => $certification->id,
        ]);
        
        // Create enough questions
        Question::factory()->count(10)->create([
            'chapter_id' => $chapter1->id,
        ]);
        Question::factory()->count(15)->create([
            'chapter_id' => $chapter2->id,
        ]);

        $data = [
            'total_questions' => 15,
            'chapter_distribution' => [
                $chapter1->id => 5,
                $chapter2->id => 10,
            ],
            'time_limit' => 90,
            'passing_score' => 75,
        ];

        $request = new ExamConfigurationRequest();
        $validator = Validator::make($data, $request->rules());

        // Manually call the custom validation method
        $request->setContainer(app());
        $request->replace($data);
        $request->withValidator($validator);

        $this->assertTrue($validator->passes());
    }

    public function test_custom_error_messages()
    {
        $request = new ExamConfigurationRequest();
        $messages = $request->messages();

        $this->assertArrayHasKey('total_questions.required', $messages);
        $this->assertArrayHasKey('chapter_distribution.required', $messages);
        $this->assertArrayHasKey('time_limit.required', $messages);
        $this->assertArrayHasKey('passing_score.required', $messages);
        $this->assertArrayHasKey('passing_score.max', $messages);
    }
}