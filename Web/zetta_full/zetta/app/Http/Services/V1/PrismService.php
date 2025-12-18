<?php

namespace App\Http\Services\V1;

use App\Models\CourseScheduleDay;
use App\Models\FormationInterest;
use App\Models\ProgressTracking;
use App\Models\QuizConfiguration;
use Illuminate\Support\Collection;
use Prism\Prism\Prism;
use Prism\Prism\Enums\Provider;
use Prism\Prism\ValueObjects\Messages\AssistantMessage;
use Prism\Prism\ValueObjects\Messages\Support\Document;
use Prism\Prism\ValueObjects\Messages\UserMessage;
use App\Models\User;
use App\Models\Formation;
use App\Models\FormationSession;
use App\Models\Module;
use App\Models\Lesson;
use App\Models\Category;
use App\Models\Payment;
use App\Models\Attendance;
use App\Models\Certification;
use App\Models\CourseSchedule;
use App\Models\Permission;
use App\Models\Question;
use App\Models\Resource;
use App\Models\Role;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Cache;

class PrismService
{
    protected ?Document $pdfDocument = null;
    protected string $cachePrefix = 'prism_conversation_';
    protected int $cacheExpiration = 60; // minutes

    public function __construct()
    {
        // Pas besoin d'initialiser messages ici, on utilisera le cache
    }

    public function setPdfDocument(?string $pdfPath): self
    {
        if ($pdfPath && file_exists($pdfPath)) {
            $this->pdfDocument = Document::fromPath($pdfPath);
        }
        
        return $this;
    }

    public function askQuestion(string $question, ?string $userId = null): array
    {
        // Utiliser un ID par défaut si aucun n'est fourni
        $cacheKey = $this->cachePrefix . ($userId ?? 'guest');
        
        // Récupérer les messages précédents du cache
        $messages = Cache::get($cacheKey, collect());
        
        // Préparer la conversation pour Prism
        $conversation = [];
        foreach ($messages as $message) {
            $conversation[] = new UserMessage($message['question']);
            $conversation[] = new AssistantMessage($message['answer']);
        }

        // Ajouter la question actuelle
        $userMessage = $this->pdfDocument
            ? new UserMessage($question, [$this->pdfDocument])
            : new UserMessage($question);
        
        $conversation[] = $userMessage;

        // Créer un prompt système qui donne accès aux informations de la base de données
        $systemPrompt = $this->generateSystemPromptWithDatabaseInfo();
        
        // Ajouter des instructions pour le formatage de la réponse
        $systemPrompt .= "\n\nLorsque tu réponds à l'utilisateur, respecte les règles suivantes pour le formatage :
1. Si tu dois présenter des données structurées, utilise un format markdown propre et lisible.
2. Pour les listes, utilise des puces ou des numéros avec des sauts de ligne appropriés.
3. Pour les tableaux, utilise la syntaxe markdown des tableaux.
4. Si tu dois montrer du code, utilise les blocs de code markdown avec la syntaxe appropriée.
5. Évite de répondre en JSON brut sauf si explicitement demandé.
6. Utilise des paragraphes bien séparés pour améliorer la lisibilité.";

        // Obtenir la réponse de l'IA
        $response = Prism::text()
            ->using(Provider::Gemini, 'gemini-2.0-flash')
            ->withSystemPrompt($systemPrompt)
            ->withMessages($conversation)
            ->asText();

        $answer = $response->text;
        
        // Nettoyer et formater la réponse si nécessaire
        $answer = $this->formatAIResponse($answer);

        // Stocker la conversation dans le cache
        $messages->push([
            'question' => $question,
            'answer' => $answer,
        ]);
        
        Cache::put($cacheKey, $messages, $this->cacheExpiration);

        return [
            'question' => $question,
            'answer' => $answer,
            'conversation_history' => $messages->toArray(),
        ];
    }
    
    /**
     * Formate la réponse de l'IA pour une meilleure présentation
     * 
     * @param string $response
     * @return string
     */
    protected function formatAIResponse(string $response): string
    {
        // Vérifier si la réponse est un JSON
        if ($this->isJson($response)) {
            // Si c'est un JSON valide, on le formate proprement
            $jsonData = json_decode($response, true);
            
            // Si le JSON contient une propriété 'text' ou 'content', on l'utilise directement
            if (isset($jsonData['text'])) {
                return $jsonData['text'];
            } elseif (isset($jsonData['content'])) {
                return $jsonData['content'];
            } elseif (isset($jsonData['answer'])) {
                return $jsonData['answer'];
            }
            
            // Sinon, on le reformate en markdown
            return "```json\n" . json_encode($jsonData, JSON_PRETTY_PRINT) . "\n```";
        }
        
        // Assurer que les sauts de ligne sont correctement préservés
        $response = str_replace("\n", "\n\n", $response);
        $response = preg_replace("/\n{3,}/", "\n\n", $response);
        
        return $response;
    }
    
    /**
     * Vérifie si une chaîne est un JSON valide
     * 
     * @param string $string
     * @return bool
     */
    protected function isJson(string $string): bool
    {
        json_decode($string);
        return json_last_error() === JSON_ERROR_NONE;
    }

    protected function generateSystemPromptWithDatabaseInfo(): string
    {
        $databaseInfo = $this->getDatabaseSchemaInfo();
        
        return "You are a helpful assistant with access to the Zetta database. " .
               "Here is the database schema information you can use to answer questions:\n\n" .
               $databaseInfo . "\n\n" .
               "Use this information to provide accurate answers about the data. " .
               "When referring to database tables and fields, be precise and use the exact names.";
    }

    protected function getDatabaseSchemaInfo(): string
    {
        $models = [
            User::class,
            Formation::class,
            FormationSession::class,
            Module::class,
            Lesson::class,
            Category::class,
            Payment::class,
            Attendance::class,
            Certification::class,
            CourseScheduleDay::class,
            FormationInterest::class,
            Permission::class,
            Role::class,
            ProgressTracking::class,
            QuizConfiguration::class,
            CourseSchedule::class,
            Question::class,
            Resource::class,
        ];

        $schemaInfo = "";
        
        // Récupérer toutes les tables de la base de données
        $allTables = DB::select('SHOW TABLES');
        $tableKey = 'Tables_in_' . config('database.connections.mysql.database');
        $allTableNames = array_map(function($table) use ($tableKey) {
            return $table->$tableKey;
        }, $allTables);
        
        $modelTables = [];
        
        // Traiter d'abord les tables avec des modèles Eloquent
        foreach ($models as $modelClass) {
            $model = new $modelClass;
            $table = $model->getTable();
            $modelTables[] = $table;
            
            $schemaInfo .= "Table: {$table}\n";
            
            // Obtenir les colonnes de la table
            $columns = Schema::getColumnListing($table);
            $schemaInfo .= "Columns: " . implode(', ', $columns) . "\n";
            
            // Obtenir les relations
            $relations = $this->getModelRelations($model);
            if (!empty($relations)) {
                $schemaInfo .= "Relations: " . implode(', ', $relations) . "\n";
            }
            
            // Ajouter quelques exemples de données (limité à 5 entrées)
            $examples = DB::table($table)->limit(5)->get();
            if ($examples->count() > 0) {
                $schemaInfo .= "Sample data (5 records):\n";
                foreach ($examples->take(5) as $example) {
                    $schemaInfo .= json_encode($example) . "\n";
                }
            }
            
            $schemaInfo .= "\n";
        }
        
        // Traiter ensuite les tables de jointure (tables sans modèles Eloquent)
        $schemaInfo .= "--- TABLES DE JOINTURE ---\n\n";
        
        foreach ($allTableNames as $table) {
            // Ignorer les tables déjà traitées avec des modèles
            if (in_array($table, $modelTables)) {
                continue;
            }
            
            // Ignorer les tables de migration Laravel et autres tables système
            if (in_array($table, ['migrations', 'password_reset_tokens', 'personal_access_tokens', 'failed_jobs'])) {
                continue;
            }
            
            $schemaInfo .= "Table de jointure: {$table}\n";
            
            // Obtenir les colonnes de la table
            $columns = Schema::getColumnListing($table);
            $schemaInfo .= "Columns: " . implode(', ', $columns) . "\n";
            
            // Détecter les clés étrangères potentielles
            $foreignKeys = [];
            foreach ($columns as $column) {
                if (str_ends_with($column, '_id') || $column === 'id') {
                    $foreignKeys[] = $column;
                }
            }
            
            if (!empty($foreignKeys)) {
                $schemaInfo .= "Potential foreign keys: " . implode(', ', $foreignKeys) . "\n";
            }
            
            // Ajouter quelques exemples de données (limité à 5 entrées)
            $examples = DB::table($table)->limit(5)->get();
            if ($examples->count() > 0) {
                $schemaInfo .= "Sample data (5 records):\n";
                foreach ($examples as $example) {
                    $schemaInfo .= json_encode($example) . "\n";
                }
            }
            
            $schemaInfo .= "\n";
        }

        return $schemaInfo;
    }

    protected function getModelRelations(Model $model): array
    {
        $relations = [];
        $methods = get_class_methods($model);
        
        foreach ($methods as $method) {
            // Exclure les méthodes communes qui ne sont pas des relations
            if (in_array($method, ['getTable', 'getKey', 'getKeyName', 'getForeignKey', 'getRouteKey', 'getRouteKeyName'])) {
                continue;
            }
            
            try {
                $reflection = new \ReflectionMethod($model, $method);
                // Si la méthode est publique et n'a pas de paramètres obligatoires
                if ($reflection->isPublic() && $reflection->getNumberOfRequiredParameters() === 0) {
                    $returnType = $reflection->getReturnType();
                    if ($returnType) {
                        $returnTypeName = $returnType->getName();
                        // Vérifier si le type de retour est une relation Eloquent
                        if (strpos($returnTypeName, 'Illuminate\Database\Eloquent\Relations') !== false) {
                            $relations[] = $method;
                        }
                    }
                }
            } catch (\ReflectionException $e) {
                continue;
            }
        }
        
        return $relations;
    }

    public function clearConversation(?string $userId = null): void
    {
        $cacheKey = $this->cachePrefix . ($userId ?? 'guest');
        Cache::forget($cacheKey);
    }
}