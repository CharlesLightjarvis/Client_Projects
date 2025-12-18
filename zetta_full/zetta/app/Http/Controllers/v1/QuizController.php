<?php

namespace App\Http\Controllers\v1;

use App\Http\Controllers\Controller;
use App\Http\Requests\v1\Questions\StoreQuestionRequest;
use App\Http\Requests\v1\Questions\UpdateQuestionRequest;
use App\Http\Requests\v1\QuizConfiguration\StoreQuizConfigurationRequest;
use App\Http\Requests\v1\QuizConfiguration\UpdateQuizConfigurationRequest;
use App\Http\Resources\v1\QuizConfigurationResource;
use App\Http\Resources\v1\QuestionResource;
use App\Http\Services\V1\QuizService;
use App\Models\Certification;

class QuizController extends Controller
{
    protected $quizService;

    public function __construct(QuizService $quizService)
    {
        $this->quizService = $quizService;
    }

    public function storeConfiguration(StoreQuizConfigurationRequest $request)
    {
        $quizConfig = $this->quizService->createQuizConfiguration($request->validated());
        return new QuizConfigurationResource($quizConfig);
    }

    public function storeQuestion(StoreQuestionRequest $request)
    {
        $question = $this->quizService->createQuestion($request->validated());
        return new QuestionResource($question);
    }

    public function getConfiguration($id)
    {
        $quizConfig = $this->quizService->getQuizConfiguration($id);
        return new QuizConfigurationResource($quizConfig);
    }

    public function getQuestion($id)
    {
        $question = $this->quizService->getQuestion($id);
        return new QuestionResource($question);
    }

    public function getAllConfigurations()
    {
        $configurations = $this->quizService->getAllQuizConfigurations();
        return QuizConfigurationResource::collection($configurations);
    }

    public function getAllQuestions()
    {
        $questions = $this->quizService->getAllQuestions();
        return QuestionResource::collection($questions);
    }

    public function updateConfiguration(UpdateQuizConfigurationRequest $request, $id)
    {
        try {
            $quizConfig = $this->quizService->updateQuizConfiguration($id, $request->validated());
            return new QuizConfigurationResource($quizConfig);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 400);
        }
    }

    public function deleteConfiguration($id)
    {
        $isDeleted = $this->quizService->deleteQuizConfiguration($id);
        if ($isDeleted) {
            return response()->json(['message' => 'Configuration supprimée avec succès']);
        }
        return response()->json(['message' => 'Configuration non trouvée'], 404);
    }

    public function updateQuestion(UpdateQuestionRequest $request, $id)
    {
        try {
            $question = $this->quizService->updateQuestion($id, $request->validated());
            return new QuestionResource($question);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 400);
        }
    }

    public function deleteQuestion($id)
    {
        $isDeleted = $this->quizService->deleteQuestion($id);
        if ($isDeleted) {
            return response()->json(['message' => 'Question supprimée avec succès']);
        }
        return response()->json(['message' => 'Question non trouvée'], 404);
    }

    /**
 * Récupère les modules associés à une certification via sa formation
 *
 * @param string $certificationId
 * @return \Illuminate\Http\JsonResponse
 */
public function getCertificationModules($certificationId)
{
    try {
        $certification = Certification::findOrFail($certificationId);
        $formation = $certification->formation;
        $modules = $formation->modules;
        
        return response()->json($modules);
    } catch (\Exception $e) {
        return response()->json(['message' => $e->getMessage()], 400);
    }
}

     /**
 * Génère un quiz basé sur une configuration spécifique
 * 
 * @param int $configId ID de la configuration du quiz
 * @param string $type Type de quiz (normal ou certification)
 * @return \Illuminate\Http\JsonResponse
 */
public function generateQuiz($configId, $type = 'normal')
{
    try {
        // Récupérer la configuration du quiz
        $config = $this->quizService->getQuizConfiguration($configId);
        
        // Vérifier que $config est bien un objet QuizConfiguration
        if (!$config instanceof \App\Models\QuizConfiguration) {
            throw new \Exception('Configuration de quiz introuvable');
        }
        
        // Générer le quiz
        $questions = $this->quizService->generateQuiz($config, $type);
        
        return response()->json([
            'success' => true,
            'data' => [
                'config' => new QuizConfigurationResource($config),
                'questions' => QuestionResource::collection($questions)
            ]
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => $e->getMessage()
        ], 400);
    }
}
}
