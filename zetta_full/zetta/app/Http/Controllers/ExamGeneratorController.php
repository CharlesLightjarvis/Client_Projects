<?php

namespace App\Http\Controllers;

use App\Models\Certification;
use App\Models\ExamSession;
use App\Services\ExamGeneratorService;
use App\Services\ExamSessionService;
use App\Http\Requests\ExamSubmissionRequest;
use App\Exceptions\InsufficientQuestionsException;
use App\Exceptions\ExamTimeExpiredException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Exception;
use InvalidArgumentException;

class ExamGeneratorController extends Controller
{
    public function __construct(
        private ExamGeneratorService $examGeneratorService,
        private ExamSessionService $examSessionService
    ) {}

    /**
     * Generate an exam for a certification
     *
     * @param Certification $certification
     * @return JsonResponse
     */
    public function generate(Certification $certification): JsonResponse
    {
        try {
            // Validate if exam can be generated
            $validation = $this->examGeneratorService->validateExamGeneration($certification);
            
            if (!$validation['valid']) {
                return response()->json([
                    'success' => false,
                    'message' => 'Cannot generate exam',
                    'errors' => $validation['errors']
                ], 422);
            }

            $examData = $this->examGeneratorService->generateExam($certification);

            return response()->json([
                'success' => true,
                'message' => 'Exam generated successfully',
                'data' => $examData
            ]);

        } catch (InsufficientQuestionsException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Insufficient questions available',
                'error' => $e->getMessage()
            ], 422);
        } catch (InvalidArgumentException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Exam generation failed',
                'error' => $e->getMessage()
            ], 422);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while generating the exam',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Start an exam session for a certification
     *
     * @param Certification $certification
     * @return JsonResponse
     */
    public function start(Certification $certification): JsonResponse
    {
        try {
            $user = Auth::user();
            
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'User not authenticated'
                ], 401);
            }

            // Check if user already has an active session
            $activeSession = $this->examSessionService->getActiveSession($user, $certification);
            
            if ($activeSession) {
                return response()->json([
                    'success' => true,
                    'message' => 'Active exam session found',
                    'data' => [
                        'session_id' => $activeSession->id,
                        'exam_data' => $activeSession->exam_data,
                        'started_at' => $activeSession->started_at,
                        'expires_at' => $activeSession->expires_at,
                        'remaining_time' => $activeSession->remaining_time,
                        'answered_questions' => $activeSession->answered_questions,
                        'total_questions' => $activeSession->total_questions
                    ]
                ]);
            }

            // Create new exam session
            $session = $this->examSessionService->createSession($user, $certification);

            return response()->json([
                'success' => true,
                'message' => 'Exam session started successfully',
                'data' => [
                    'session_id' => $session->id,
                    'exam_data' => $session->exam_data,
                    'started_at' => $session->started_at,
                    'expires_at' => $session->expires_at,
                    'remaining_time' => $session->remaining_time,
                    'total_questions' => $session->total_questions
                ]
            ]);

        } catch (InsufficientQuestionsException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Cannot start exam session: insufficient questions',
                'error' => $e->getMessage()
            ], 422);
        } catch (InvalidArgumentException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Cannot start exam session',
                'error' => $e->getMessage()
            ], 422);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while starting the exam',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Submit exam answers and calculate score
     *
     * @param ExamSession $session
     * @param ExamSubmissionRequest $request
     * @return JsonResponse
     */
    public function submit(ExamSession $session, ExamSubmissionRequest $request): JsonResponse
    {
        try {
            $user = Auth::user();
            
            if (!$user || $session->user_id !== $user->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized access to exam session'
                ], 403);
            }

            // Check if session is expired
            if ($session->isExpired()) {
                $session = $this->examSessionService->expireSession($session);
                
                return response()->json([
                    'success' => false,
                    'message' => 'Exam session has expired',
                    'data' => [
                        'session_id' => $session->id,
                        'status' => $session->status,
                        'score' => $session->score,
                        'submitted_at' => $session->submitted_at
                    ]
                ], 422);
            }

            // Check if session is already submitted
            if ($session->status !== 'active') {
                return response()->json([
                    'success' => false,
                    'message' => 'Exam session is not active',
                    'data' => [
                        'session_id' => $session->id,
                        'status' => $session->status,
                        'score' => $session->score,
                        'submitted_at' => $session->submitted_at
                    ]
                ], 422);
            }

            // Save all answers before submitting
            $answers = $request->validated()['answers'] ?? [];
            foreach ($answers as $questionId => $answerIds) {
                $this->examSessionService->saveAnswer($session, $questionId, $answerIds);
            }

            // Submit the exam
            $session = $this->examSessionService->submitExam($session);

            // Generate detailed result
            $detailedResult = $this->examSessionService->generateDetailedResult($session);

            return response()->json([
                'success' => true,
                'message' => 'Exam submitted successfully',
                'data' => [
                    'quiz_result' => $detailedResult
                ]
            ]);

        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while submitting the exam',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Save an answer for a specific question in the exam session
     *
     * @param ExamSession $session
     * @param Request $request
     * @return JsonResponse
     */
    public function saveAnswer(ExamSession $session, Request $request): JsonResponse
    {
        try {
            $user = Auth::user();
            
            if (!$user || $session->user_id !== $user->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized access to exam session'
                ], 403);
            }

            if (!$session->isActive()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Exam session is not active or has expired'
                ], 422);
            }

            $validated = $request->validate([
                'question_id' => 'required|string',
                'answer_ids' => 'required|array',
                'answer_ids.*' => 'integer'
            ]);

            $this->examSessionService->saveAnswer(
                $session,
                $validated['question_id'],
                $validated['answer_ids']
            );

            return response()->json([
                'success' => true,
                'message' => 'Answer saved successfully',
                'data' => [
                    'answered_questions' => $session->fresh()->answered_questions,
                    'total_questions' => $session->total_questions,
                    'remaining_time' => $session->remaining_time
                ]
            ]);

        } catch (ExamTimeExpiredException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Exam time expired',
                'error' => $e->getMessage()
            ], 422);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while saving the answer',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get exam session status and remaining time
     *
     * @param ExamSession $session
     * @return JsonResponse
     */
    public function status(ExamSession $session): JsonResponse
    {
        try {
            $user = Auth::user();
            
            if (!$user || $session->user_id !== $user->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized access to exam session'
                ], 403);
            }

            // Check if session has expired and update status if needed
            if ($session->status === 'active' && $session->isExpired()) {
                $session = $this->examSessionService->expireSession($session);
            }

            return response()->json([
                'success' => true,
                'data' => [
                    'session_id' => $session->id,
                    'status' => $session->status,
                    'started_at' => $session->started_at,
                    'expires_at' => $session->expires_at,
                    'submitted_at' => $session->submitted_at,
                    'remaining_time' => $session->remaining_time,
                    'answered_questions' => $session->answered_questions,
                    'total_questions' => $session->total_questions,
                    'score' => $session->score
                ]
            ]);

        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while retrieving session status',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}