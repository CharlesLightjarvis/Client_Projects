<?php

namespace App\Http\Controllers\v1;

use App\Http\Controllers\Controller;
use App\Http\Services\V1\PrismService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class PrismController extends Controller
{
    protected PrismService $prismService;

    public function __construct(PrismService $prismService)
    {
        $this->prismService = $prismService;
    }

    /**
     * Poser une question à l'IA
     * 
     * @param Request $request
     * @return JsonResponse
     */
    public function askQuestion(Request $request): JsonResponse
    {
        $request->validate([
            'question' => 'required|string',
            'pdf_path' => 'nullable|string',
        ]);

        // Configurer le document PDF si fourni
        if ($request->has('pdf_path')) {
            $this->prismService->setPdfDocument($request->pdf_path);
        }

        // Obtenir l'ID de l'utilisateur authentifié si disponible
        $userId = Auth::id();

        // Poser la question à l'IA
        $response = $this->prismService->askQuestion(
            $request->question,
            $userId
        );

        return response()->json($response);
    }

    /**
     * Effacer l'historique de conversation
     * 
     * @return JsonResponse
     */
    public function clearConversation(): JsonResponse
    {
        $this->prismService->clearConversation();

        return response()->json([
            'message' => 'Conversation history cleared successfully',
        ]);
    }
}