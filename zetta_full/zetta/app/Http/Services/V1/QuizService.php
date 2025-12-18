<?php

namespace App\Http\Services\V1;

use App\Models\Module;
use App\Models\QuizConfiguration;
use App\Models\Question;
use App\Models\Lesson;
use App\Models\Certification;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class QuizService
{
    public function createQuizConfiguration(array $data)
    {
        try {
            DB::beginTransaction();

            // Vérifier que la somme des pourcentages est égale à 100
            $totalPercentage = $data['difficulty_distribution']['easy'] +
                $data['difficulty_distribution']['medium'] +
                $data['difficulty_distribution']['hard'];

            if ($totalPercentage !== 100) {
                throw new \InvalidArgumentException('La somme des pourcentages de difficulté doit être égale à 100');
            }

            // Vérifier la distribution par module si elle est fournie
            if (isset($data['module_distribution']) && !empty($data['module_distribution'])) {
                $totalModulePercentage = array_sum($data['module_distribution']);
                
                // Vérifier que la somme est égale à 100 seulement pour les certifications
                if ($data['configurable_type'] === 'certification' && $totalModulePercentage !== 100) {
                    throw new \InvalidArgumentException('La somme des pourcentages par module doit être égale à 100');
                }
            }

            // Déterminer le type de modèle
            $modelClass = match ($data['configurable_type']) {
                'lesson' => Lesson::class,
                'certification' => Certification::class,
                default => throw new \InvalidArgumentException('Invalid configurable type')
            };

            // Vérifier si l'entité existe
            $configurable = $modelClass::findOrFail($data['configurable_id']);

            // Créer la configuration
            $quizConfig = QuizConfiguration::create([
                'configurable_type' => $modelClass,
                'configurable_id' => $configurable->id,
                'total_questions' => $data['total_questions'],
                'difficulty_distribution' => $data['difficulty_distribution'],
                'module_distribution' => $data['module_distribution'] ?? null,
                'passing_score' => $data['passing_score'],
                'time_limit' => $data['time_limit'],
                'question_type' => $data['question_type'] ?? 'normal' 
            ]);

            DB::commit();
            return $quizConfig;
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    public function createQuestion(array $data)
    {
        try {
            DB::beginTransaction();

            // Déterminer le type de modèle
            $modelClass = match ($data['questionable_type']) {
                'lesson' => Lesson::class,
                'module' => Module::class,
                default => throw new \InvalidArgumentException('Invalid questionable type: ' . $data['questionable_type'])
            };

            // Vérifier si l'entité existe et récupérer son ID
            $questionable = $modelClass::findOrFail($data['questionable_id']);
            
            // Debug - Afficher les informations dans le log
            Log::info('Création de question', [
                'questionable_type reçu' => $data['questionable_type'],
                'questionable_id reçu' => $data['questionable_id'],
                'modelClass traduit' => $modelClass,
                'questionable trouvé' => $questionable ? true : false,
                'questionable ID' => $questionable->id ?? 'non trouvé'
            ]);

            // Créer la question
            $question = Question::create([
                'questionable_type' => $modelClass, // Classe complète comme "App\Models\Module"
                'questionable_id' => $questionable->id,
                'question' => $data['question'],
                'answers' => $data['answers'],
                'difficulty' => $data['difficulty'],
                'type' => $data['type'],
                'points' => $data['points']
            ]);

            // Debug - Afficher les informations dans le log
            Log::info('Création de question', [
                'questionable_type' => $modelClass, // Classe complète comme "App\Models\Module"
                'questionable_id' => $questionable->id,
                'question' => $data['question'],
                'answers' => $data['answers'],
                'difficulty' => $data['difficulty'],
                'type' => $data['type'],
                'points' => $data['points']
            ]);

            DB::commit();
            return $question;
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    public function updateQuizConfiguration($id, array $data)
    {
        try {
            DB::beginTransaction();

            $quizConfig = QuizConfiguration::findOrFail($id);

            if (isset($data['difficulty_distribution'])) {
                $totalPercentage = $data['difficulty_distribution']['easy'] +
                    $data['difficulty_distribution']['medium'] +
                    $data['difficulty_distribution']['hard'];

                if ($totalPercentage !== 100) {
                    throw new \InvalidArgumentException('La somme des pourcentages de difficulté doit être égale à 100');
                }
            }

            // Vérifier la distribution par module si elle est fournie
            if (isset($data['module_distribution']) && !empty($data['module_distribution'])) {
                $totalModulePercentage = array_sum($data['module_distribution']);
                
                // Vérifier que la somme est égale à 100 seulement pour les certifications
                // Récupérer le type d'objet configurable
                $configurableType = $quizConfig->configurable_type;
                $isCertification = str_contains($configurableType, 'Certification');
                
                if ($isCertification && $totalModulePercentage !== 100) {
                    throw new \InvalidArgumentException('La somme des pourcentages par module doit être égale à 100');
                }
            }

            // S'assurer que question_type est inclus dans la mise à jour
            if (isset($data['question_type'])) {
                $quizConfig->question_type = $data['question_type'];
            }

            $quizConfig->update($data);

            DB::commit();
            return $quizConfig;
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }
    public function deleteQuizConfiguration($id)
    {
        try {
            DB::beginTransaction();

            $quizConfig = QuizConfiguration::findOrFail($id);
            $quizConfig->delete();

            DB::commit();
            return true;
        } catch (\Exception $e) {
            DB::rollBack();
            return false;
        }
    }

    public function updateQuestion($id, array $data)
    {
        try {
            DB::beginTransaction();

            $question = Question::findOrFail($id);
            
            // Traiter le questionable_type si présent
            if (isset($data['questionable_type'])) {
                // Déterminer le type de modèle
                $modelClass = match ($data['questionable_type']) {
                    'lesson' => Lesson::class,
                    'module' => Module::class,
                    default => throw new \InvalidArgumentException('Invalid questionable type: ' . $data['questionable_type'])
                };
                
                // Vérifier si l'entité existe
                if (isset($data['questionable_id'])) {
                    $questionable = $modelClass::findOrFail($data['questionable_id']);
                    $data['questionable_id'] = $questionable->id;
                }
                
                // Remplacer le type simplifié par la classe complète
                $data['questionable_type'] = $modelClass;
            }
            
            // S'assurer que le type est correctement défini
            if (isset($data['type']) && in_array($data['type'], ['normal', 'certification'])) {
                // Le type est déjà correct, pas besoin de le modifier
                Log::info('Mise à jour du type de question', [
                    'question_id' => $id,
                    'nouveau_type' => $data['type']
                ]);
            }

            $question->update($data);

            DB::commit();
            return $question;
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    public function deleteQuestion($id)
    {
        try {
            DB::beginTransaction();

            $question = Question::findOrFail($id);
            $question->delete();

            DB::commit();
            return true;
        } catch (\Exception $e) {
            DB::rollBack();
            return false;
        }
    }

    public function getQuizConfiguration($id)
    {
        return QuizConfiguration::with('configurable')->findOrFail($id);
    }

    public function getQuestion($id)
    {
        return Question::with('questionable')->findOrFail($id);
    }

    public function getAllQuizConfigurations()
    {
        $quizConfig = QuizConfiguration::with('configurable')->get();
        
        // Logging pour déboguer module_distribution
        Log::info('QuizConfiguration récupérée', [
            
            $quizConfig->toArray()
        ]);
        
        return $quizConfig;
    }

    public function getAllQuestions()
    {
        return Question::with('questionable')->get();
    }

    public function generateQuiz(QuizConfiguration $config, string $quizType = 'normal')
    {
        // Déterminer le type de question à récupérer
        $questionType = ($quizType === 'certification') ? 'certification' : 'normal';
        
        // Récupérer le nombre total de questions à sélectionner
        $totalQuestions = $config->total_questions;
        
        // Collection pour stocker les questions sélectionnées
        $selectedQuestions = collect();
        
        // Si nous avons une distribution par module
        if (!empty($config->module_distribution)) {
            // Pour une certification, récupérer les modules de la formation associée
            $moduleIds = [];
            
            if ($quizType === 'certification' && $config->configurable_type === 'App\\Models\\Certification') {
                $certification = Certification::find($config->configurable_id);
                if ($certification && $certification->formation) {
                    $moduleIds = $certification->formation->modules->pluck('id')->toArray();
                }
            } elseif ($config->configurable_type === 'App\\Models\\Lesson') {
                // Pour une leçon, nous utilisons son module parent
                $lesson = Lesson::find($config->configurable_id);
                if ($lesson && $lesson->module) {
                    $moduleIds = [$lesson->module->id];
                }
            }
            
            // Si nous n'avons pas de moduleIds, utiliser ceux de la distribution
            if (empty($moduleIds)) {
                $moduleIds = array_keys($config->module_distribution);
            }
            
            // Pour chaque module dans la distribution
            foreach ($moduleIds as $moduleId) {
                // Vérifier si le module est dans la distribution
                if (!isset($config->module_distribution[$moduleId])) {
                    continue;
                }
                
                // Calculer le nombre de questions à prendre de ce module
                $modulePercentage = $config->module_distribution[$moduleId];
                $moduleQuestionCount = ceil(($modulePercentage / 100) * $totalQuestions);
                
                // Si nous avons une distribution par difficulté
                if (!empty($config->difficulty_distribution)) {
                    // Pour chaque niveau de difficulté
                    foreach ($config->difficulty_distribution as $difficulty => $percentage) {
                        // Calculer le nombre de questions de cette difficulté pour ce module
                        $difficultyQuestionCount = ceil(($percentage / 100) * $moduleQuestionCount);
                        
                        // Récupérer les questions de ce module avec cette difficulté et le type spécifié
                        $moduleQuestions = Question::where('questionable_type', \App\Models\Module::class)
                            ->where('questionable_id', $moduleId)
                            ->where('difficulty', $difficulty)
                            ->where('type', $questionType)
                            ->inRandomOrder()
                            ->limit($difficultyQuestionCount)
                            ->get();
                        
                        // Ajouter les questions à la collection
                        $selectedQuestions = $selectedQuestions->merge($moduleQuestions);
                        
                        // Si nous n'avons pas assez de questions du module, chercher dans les leçons du module
                        if ($moduleQuestions->count() < $difficultyQuestionCount) {
                            $remainingCount = $difficultyQuestionCount - $moduleQuestions->count();
                            
                            // Récupérer les IDs des leçons de ce module
                            $lessonIds = Lesson::where('module_id', $moduleId)->pluck('id')->toArray();
                            
                            if (!empty($lessonIds)) {
                                // Récupérer les questions des leçons de ce module
                                $lessonQuestions = Question::where('questionable_type', Lesson::class)
                                    ->whereIn('questionable_id', $lessonIds)
                                    ->where('difficulty', $difficulty)
                                    ->where('type', $questionType)
                                    ->inRandomOrder()
                                    ->limit($remainingCount)
                                    ->get();
                                
                                // Ajouter les questions à la collection
                                $selectedQuestions = $selectedQuestions->merge($lessonQuestions);
                            }
                        }
                    }
                } else {
                    // Pas de distribution par difficulté, prendre des questions aléatoires du module
                    $moduleQuestions = Question::where('questionable_type', \App\Models\Module::class)
                        ->where('questionable_id', $moduleId)
                        ->where('type', $questionType)
                        ->inRandomOrder()
                        ->limit($moduleQuestionCount)
                        ->get();
                    
                    // Ajouter les questions à la collection
                    $selectedQuestions = $selectedQuestions->merge($moduleQuestions);
                    
                    // Si nous n'avons pas assez de questions du module, chercher dans les leçons du module
                    if ($moduleQuestions->count() < $moduleQuestionCount) {
                        $remainingCount = $moduleQuestionCount - $moduleQuestions->count();
                        
                        // Récupérer les IDs des leçons de ce module
                        $lessonIds = Lesson::where('module_id', $moduleId)->pluck('id')->toArray();
                        
                        if (!empty($lessonIds)) {
                            // Récupérer les questions des leçons de ce module
                            $lessonQuestions = Question::where('questionable_type', Lesson::class)
                                ->whereIn('questionable_id', $lessonIds)
                                ->where('type', $questionType)
                                ->inRandomOrder()
                                ->limit($remainingCount)
                                ->get();
                            
                            // Ajouter les questions à la collection
                            $selectedQuestions = $selectedQuestions->merge($lessonQuestions);
                        }
                    }
                }
            }
        } else if (!empty($config->difficulty_distribution)) {
            // Si nous avons seulement une distribution par difficulté (pas par module)
            foreach ($config->difficulty_distribution as $difficulty => $percentage) {
                // Calculer le nombre de questions de cette difficulté
                $difficultyQuestionCount = ceil(($percentage / 100) * $totalQuestions);
                
                // Récupérer les questions avec cette difficulté et le type spécifié (modules et leçons)
                $questions = Question::where(function($query) {
                        $query->where('questionable_type', \App\Models\Module::class)
                              ->orWhere('questionable_type', \App\Models\Lesson::class);
                    })
                    ->where('difficulty', $difficulty)
                    ->where('type', $questionType)
                    ->inRandomOrder()
                    ->limit($difficultyQuestionCount)
                    ->get();
                
                // Ajouter les questions à la collection
                $selectedQuestions = $selectedQuestions->merge($questions);
            }
        }
        
        // Si nous n'avons pas assez de questions, compléter avec des questions aléatoires du bon type
        if ($selectedQuestions->count() < $totalQuestions) {
            // Extraire les IDs des questions déjà sélectionnées
            $existingIds = $selectedQuestions->pluck('id')->toArray();
            
            $missingCount = $totalQuestions - $selectedQuestions->count();
            
            // Récupérer des questions supplémentaires du bon type (modules et leçons uniquement)
            $additionalQuestions = Question::where(function($query) {
                    $query->where('questionable_type', \App\Models\Module::class)
                          ->orWhere('questionable_type', \App\Models\Lesson::class);
                })
                ->where('type', $questionType)
                ->whereNotIn('id', $existingIds)
                ->inRandomOrder()
                ->limit($missingCount)
                ->get();
            
            // Ajouter les questions à la collection
            $selectedQuestions = $selectedQuestions->merge($additionalQuestions);
        }
        
        // Limiter au nombre total de questions demandé (au cas où nous en aurions trop)
        $result = $selectedQuestions->take($totalQuestions);
        
        // Mélanger les questions pour éviter qu'elles soient toujours dans le même ordre
        return $result->shuffle();
    }
}