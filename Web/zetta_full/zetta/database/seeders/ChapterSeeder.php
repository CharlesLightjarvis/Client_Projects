<?php

namespace Database\Seeders;

use App\Models\Certification;
use App\Models\Chapter;
use App\Models\Question;
use App\Enums\QuestionDifficultyEnum;
use App\Enums\QuestionTypeEnum;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ChapterSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->seedReactCertification();
        $this->seedDevOpsCertification();
        $this->seedPythonAICertification();
    }

    private function seedReactCertification(): void
    {
        $certification = Certification::where('slug', 'certification-reactjs-developpeur-professionnel')->first();
        if (!$certification) return;

        $chapters = [
            [
                'name' => 'Fondamentaux React et JSX',
                'description' => 'Concepts de base de React, Virtual DOM, JSX et composants.',
                'questions' => [
                    [
                        'question' => 'Quel est l\'avantage principal du Virtual DOM dans React ?',
                        'difficulty' => QuestionDifficultyEnum::EASY->value,
                        'points' => 2,
                        'answers' => [
                            ['text' => 'Améliore les performances en minimisant les manipulations DOM', 'correct' => true],
                            ['text' => 'Permet d\'écrire du HTML directement en JavaScript', 'correct' => false],
                            ['text' => 'Remplace complètement le DOM réel', 'correct' => false],
                            ['text' => 'Simplifie uniquement la syntaxe CSS', 'correct' => false]
                        ]
                    ],
                    [
                        'question' => 'Quelle syntaxe JSX est correcte pour afficher une variable ?',
                        'difficulty' => QuestionDifficultyEnum::EASY->value,
                        'points' => 1,
                        'answers' => [
                            ['text' => '{nomVariable}', 'correct' => true],
                            ['text' => '{{nomVariable}}', 'correct' => false],
                            ['text' => '${nomVariable}', 'correct' => false],
                            ['text' => '[nomVariable]', 'correct' => false]
                        ]
                    ],
                    [
                        'question' => 'Comment créer un élément React sans utiliser JSX ?',
                        'difficulty' => QuestionDifficultyEnum::MEDIUM->value,
                        'points' => 3,
                        'answers' => [
                            ['text' => 'React.createElement("div", null, "Hello")', 'correct' => true],
                            ['text' => 'React.makeElement("div", "Hello")', 'correct' => false],
                            ['text' => 'React.newElement("div", {}, "Hello")', 'correct' => false],
                            ['text' => 'createElement("div", "Hello")', 'correct' => false]
                        ]
                    ],
                    [
                        'question' => 'Quelle est la différence entre un élément et un composant React ?',
                        'difficulty' => QuestionDifficultyEnum::MEDIUM->value,
                        'points' => 4,
                        'answers' => [
                            ['text' => 'Un élément est une description d\'un composant, un composant est une fonction/classe', 'correct' => true],
                            ['text' => 'Un composant est plus simple qu\'un élément', 'correct' => false],
                            ['text' => 'Il n\'y a pas de différence', 'correct' => false],
                            ['text' => 'Un élément peut avoir des props, pas un composant', 'correct' => false]
                        ]
                    ],
                    [
                        'question' => 'Que se passe-t-il si on retourne plusieurs éléments sans conteneur parent ?',
                        'difficulty' => QuestionDifficultyEnum::EASY->value,
                        'points' => 2,
                        'answers' => [
                            ['text' => 'Erreur de compilation, il faut un Fragment ou un conteneur', 'correct' => true],
                            ['text' => 'React crée automatiquement un div conteneur', 'correct' => false],
                            ['text' => 'Ça fonctionne normalement', 'correct' => false],
                            ['text' => 'Seul le premier élément est rendu', 'correct' => false]
                        ]
                    ]
                ]
            ],
            [
                'name' => 'State Management et Hooks',
                'description' => 'Gestion d\'état avec useState, useEffect et hooks personnalisés.',
                'questions' => [
                    [
                        'question' => 'Comment déclarer un state avec useState ?',
                        'difficulty' => QuestionDifficultyEnum::EASY->value,
                        'points' => 2,
                        'answers' => [
                            ['text' => 'const [count, setCount] = useState(0);', 'correct' => true],
                            ['text' => 'const count = useState(0);', 'correct' => false],
                            ['text' => 'const [count] = useState(0);', 'correct' => false],
                            ['text' => 'useState count = 0;', 'correct' => false]
                        ]
                    ],
                    [
                        'question' => 'Quand useEffect est-il exécuté sans tableau de dépendances ?',
                        'difficulty' => QuestionDifficultyEnum::MEDIUM->value,
                        'points' => 4,
                        'answers' => [
                            ['text' => 'À chaque rendu du composant', 'correct' => true],
                            ['text' => 'Uniquement au premier rendu', 'correct' => false],
                            ['text' => 'Uniquement au démontage du composant', 'correct' => false],
                            ['text' => 'Jamais', 'correct' => false]
                        ]
                    ],
                    [
                        'question' => 'Comment mettre à jour un state basé sur la valeur précédente ?',
                        'difficulty' => QuestionDifficultyEnum::MEDIUM->value,
                        'points' => 3,
                        'answers' => [
                            ['text' => 'setCount(prevCount => prevCount + 1)', 'correct' => true],
                            ['text' => 'setCount(count + 1)', 'correct' => false],
                            ['text' => 'count = count + 1', 'correct' => false],
                            ['text' => 'useState(count + 1)', 'correct' => false]
                        ]
                    ],
                    [
                        'question' => 'Comment nettoyer un effect dans useEffect ?',
                        'difficulty' => QuestionDifficultyEnum::HARD->value,
                        'points' => 5,
                        'answers' => [
                            ['text' => 'Retourner une fonction de nettoyage depuis useEffect', 'correct' => true],
                            ['text' => 'Utiliser useCleanup()', 'correct' => false],
                            ['text' => 'Appeler clearEffect()', 'correct' => false],
                            ['text' => 'Passer null comme deuxième paramètre', 'correct' => false]
                        ]
                    ],
                    [
                        'question' => 'Quel hook utiliser pour persister une valeur entre les rendus sans déclencher de re-rendu ?',
                        'difficulty' => QuestionDifficultyEnum::MEDIUM->value,
                        'points' => 4,
                        'answers' => [
                            ['text' => 'useRef', 'correct' => true],
                            ['text' => 'useState', 'correct' => false],
                            ['text' => 'useMemo', 'correct' => false],
                            ['text' => 'useCallback', 'correct' => false]
                        ]
                    ]
                ]
            ],
            [
                'name' => 'Optimisation et Bonnes Pratiques',
                'description' => 'Performance, lazy loading, mémorisation, tests.',
                'questions' => [
                    [
                        'question' => 'Quel hook utiliser pour mémoriser une valeur coûteuse ?',
                        'difficulty' => QuestionDifficultyEnum::MEDIUM->value,
                        'points' => 4,
                        'answers' => [
                            ['text' => 'useMemo', 'correct' => true],
                            ['text' => 'useCallback', 'correct' => false],
                            ['text' => 'useEffect', 'correct' => false],
                            ['text' => 'useState', 'correct' => false]
                        ]
                    ],
                    [
                        'question' => 'Comment implémenter le lazy loading d\'un composant ?',
                        'difficulty' => QuestionDifficultyEnum::HARD->value,
                        'points' => 6,
                        'answers' => [
                            ['text' => 'const LazyComponent = lazy(() => import("./Component"));', 'correct' => true],
                            ['text' => 'const LazyComponent = import("./Component");', 'correct' => false],
                            ['text' => 'const LazyComponent = React.memo(Component);', 'correct' => false],
                            ['text' => 'const LazyComponent = useMemo(() => Component);', 'correct' => false]
                        ]
                    ],
                    [
                        'question' => 'À quoi sert React.memo() ?',
                        'difficulty' => QuestionDifficultyEnum::MEDIUM->value,
                        'points' => 4,
                        'answers' => [
                            ['text' => 'Éviter le re-rendu si les props n\'ont pas changé', 'correct' => true],
                            ['text' => 'Mémoriser les valeurs de state', 'correct' => false],
                            ['text' => 'Optimiser les appels API', 'correct' => false],
                            ['text' => 'Gérer le cache des composants', 'correct' => false]
                        ]
                    ],
                    [
                        'question' => 'Quelle est la différence entre useMemo et useCallback ?',
                        'difficulty' => QuestionDifficultyEnum::HARD->value,
                        'points' => 5,
                        'answers' => [
                            ['text' => 'useMemo mémorise une valeur, useCallback mémorise une fonction', 'correct' => true],
                            ['text' => 'useCallback est plus rapide que useMemo', 'correct' => false],
                            ['text' => 'useMemo est pour les composants, useCallback pour les hooks', 'correct' => false],
                            ['text' => 'Il n\'y a pas de différence', 'correct' => false]
                        ]
                    ],
                    [
                        'question' => 'Comment utiliser Suspense avec lazy loading ?',
                        'difficulty' => QuestionDifficultyEnum::HARD->value,
                        'points' => 6,
                        'answers' => [
                            ['text' => '<Suspense fallback={<Loading />}><LazyComponent /></Suspense>', 'correct' => true],
                            ['text' => '<Suspense><LazyComponent fallback={<Loading />} /></Suspense>', 'correct' => false],
                            ['text' => '<LazyComponent><Suspense><Loading /></Suspense></LazyComponent>', 'correct' => false],
                            ['text' => '<Suspense loading={true}><LazyComponent /></Suspense>', 'correct' => false]
                        ]
                    ]
                ]
            ]
        ];

        $this->createChaptersWithQuestions($certification, $chapters);
    }

    private function seedDevOpsCertification(): void
    {
        $certification = Certification::where('slug', 'certification-devops-engineer-aws-specialist')->first();
        if (!$certification) return;

        $chapters = [
            [
                'name' => 'Fondamentaux DevOps et Culture',
                'description' => 'Principes DevOps, collaboration, méthodologies agiles.',
                'questions' => [
                    [
                        'question' => 'Quel est l\'objectif principal du mouvement DevOps ?',
                        'difficulty' => QuestionDifficultyEnum::EASY->value,
                        'points' => 2,
                        'answers' => [
                            ['text' => 'Améliorer la collaboration entre développement et opérations', 'correct' => true],
                            ['text' => 'Remplacer les équipes d\'opérations par des développeurs', 'correct' => false],
                            ['text' => 'Automatiser uniquement les tests', 'correct' => false],
                            ['text' => 'Réduire le nombre de déploiements', 'correct' => false]
                        ]
                    ],
                    [
                        'question' => 'Que signifie l\'acronyme CALMS dans DevOps ?',
                        'difficulty' => QuestionDifficultyEnum::MEDIUM->value,
                        'points' => 4,
                        'answers' => [
                            ['text' => 'Culture, Automation, Lean, Measurement, Sharing', 'correct' => true],
                            ['text' => 'Code, Automation, Linux, Monitoring, Security', 'correct' => false],
                            ['text' => 'Continuous, Automated, Lean, Measured, Secure', 'correct' => false],
                            ['text' => 'Cloud, API, Load-balancing, Microservices, Scaling', 'correct' => false]
                        ]
                    ],
                    [
                        'question' => 'Quel est le principe du "Shift Left" en DevOps ?',
                        'difficulty' => QuestionDifficultyEnum::MEDIUM->value,
                        'points' => 4,
                        'answers' => [
                            ['text' => 'Intégrer les tests et la sécurité plus tôt dans le cycle de développement', 'correct' => true],
                            ['text' => 'Déplacer les serveurs vers la gauche du datacenter', 'correct' => false],
                            ['text' => 'Commencer par les fonctionnalités les moins importantes', 'correct' => false],
                            ['text' => 'Utiliser uniquement des outils open source', 'correct' => false]
                        ]
                    ],
                    [
                        'question' => 'Qu\'est-ce que l\'approche "Infrastructure as Code" ?',
                        'difficulty' => QuestionDifficultyEnum::MEDIUM->value,
                        'points' => 3,
                        'answers' => [
                            ['text' => 'Gérer l\'infrastructure via des fichiers de configuration versionnés', 'correct' => true],
                            ['text' => 'Remplacer tous les serveurs par du code', 'correct' => false],
                            ['text' => 'Écrire du code directement sur les serveurs', 'correct' => false],
                            ['text' => 'Utiliser uniquement des services cloud', 'correct' => false]
                        ]
                    ]
                ]
            ],
            [
                'name' => 'Conteneurisation avec Docker',
                'description' => 'Docker, images, conteneurs, Dockerfile, orchestration.',
                'questions' => [
                    [
                        'question' => 'Quelle commande permet de construire une image Docker ?',
                        'difficulty' => QuestionDifficultyEnum::EASY->value,
                        'points' => 2,
                        'answers' => [
                            ['text' => 'docker build -t monapp .', 'correct' => true],
                            ['text' => 'docker create monapp', 'correct' => false],
                            ['text' => 'docker run monapp', 'correct' => false],
                            ['text' => 'docker make monapp', 'correct' => false]
                        ]
                    ],
                    [
                        'question' => 'Quelle instruction Dockerfile définit l\'image de base ?',
                        'difficulty' => QuestionDifficultyEnum::EASY->value,
                        'points' => 2,
                        'answers' => [
                            ['text' => 'FROM', 'correct' => true],
                            ['text' => 'BASE', 'correct' => false],
                            ['text' => 'IMAGE', 'correct' => false],
                            ['text' => 'SOURCE', 'correct' => false]
                        ]
                    ],
                    [
                        'question' => 'Comment exposer un port dans un Dockerfile ?',
                        'difficulty' => QuestionDifficultyEnum::EASY->value,
                        'points' => 2,
                        'answers' => [
                            ['text' => 'EXPOSE 8080', 'correct' => true],
                            ['text' => 'PORT 8080', 'correct' => false],
                            ['text' => 'OPEN 8080', 'correct' => false],
                            ['text' => 'LISTEN 8080', 'correct' => false]
                        ]
                    ],
                    [
                        'question' => 'Quelle est la différence entre COPY et ADD dans Dockerfile ?',
                        'difficulty' => QuestionDifficultyEnum::MEDIUM->value,
                        'points' => 4,
                        'answers' => [
                            ['text' => 'ADD peut extraire des archives et télécharger des URLs, COPY est plus simple', 'correct' => true],
                            ['text' => 'COPY est plus rapide que ADD', 'correct' => false],
                            ['text' => 'ADD est déprécié, utiliser COPY uniquement', 'correct' => false],
                            ['text' => 'Il n\'y a pas de différence', 'correct' => false]
                        ]
                    ],
                    [
                        'question' => 'Comment créer un volume Docker pour persister les données ?',
                        'difficulty' => QuestionDifficultyEnum::MEDIUM->value,
                        'points' => 4,
                        'answers' => [
                            ['text' => 'docker run -v /host/path:/container/path image', 'correct' => true],
                            ['text' => 'docker run --volume=/host/path image', 'correct' => false],
                            ['text' => 'docker run --mount /host/path image', 'correct' => false],
                            ['text' => 'docker run --storage /host/path image', 'correct' => false]
                        ]
                    ],
                    [
                        'question' => 'Qu\'est-ce qu\'un multi-stage build dans Docker ?',
                        'difficulty' => QuestionDifficultyEnum::HARD->value,
                        'points' => 6,
                        'answers' => [
                            ['text' => 'Utiliser plusieurs FROM dans un Dockerfile pour optimiser la taille', 'correct' => true],
                            ['text' => 'Construire plusieurs images en parallèle', 'correct' => false],
                            ['text' => 'Utiliser plusieurs Dockerfile', 'correct' => false],
                            ['text' => 'Exécuter plusieurs commandes BUILD', 'correct' => false]
                        ]
                    ]
                ]
            ],
            [
                'name' => 'Infrastructure AWS',
                'description' => 'Services AWS essentiels, EC2, S3, RDS, VPC, IAM.',
                'questions' => [
                    [
                        'question' => 'Quel service AWS fournit des machines virtuelles ?',
                        'difficulty' => QuestionDifficultyEnum::EASY->value,
                        'points' => 1,
                        'answers' => [
                            ['text' => 'EC2', 'correct' => true],
                            ['text' => 'S3', 'correct' => false],
                            ['text' => 'RDS', 'correct' => false],
                            ['text' => 'Lambda', 'correct' => false]
                        ]
                    ],
                    [
                        'question' => 'Quel service AWS est utilisé pour le stockage d\'objets ?',
                        'difficulty' => QuestionDifficultyEnum::EASY->value,
                        'points' => 2,
                        'answers' => [
                            ['text' => 'S3', 'correct' => true],
                            ['text' => 'EBS', 'correct' => false],
                            ['text' => 'EFS', 'correct' => false],
                            ['text' => 'FSx', 'correct' => false]
                        ]
                    ],
                    [
                        'question' => 'Qu\'est-ce qu\'un VPC dans AWS ?',
                        'difficulty' => QuestionDifficultyEnum::MEDIUM->value,
                        'points' => 3,
                        'answers' => [
                            ['text' => 'Virtual Private Cloud - réseau virtuel isolé', 'correct' => true],
                            ['text' => 'Virtual Processing Center - centre de calcul', 'correct' => false],
                            ['text' => 'Virtual Public Container - conteneur public', 'correct' => false],
                            ['text' => 'Virtual Performance Controller - contrôleur de performance', 'correct' => false]
                        ]
                    ],
                    [
                        'question' => 'Quel service AWS gère l\'authentification et les autorisations ?',
                        'difficulty' => QuestionDifficultyEnum::EASY->value,
                        'points' => 2,
                        'answers' => [
                            ['text' => 'IAM', 'correct' => true],
                            ['text' => 'Cognito', 'correct' => false],
                            ['text' => 'STS', 'correct' => false],
                            ['text' => 'KMS', 'correct' => false]
                        ]
                    ],
                    [
                        'question' => 'Comment sécuriser une instance EC2 ?',
                        'difficulty' => QuestionDifficultyEnum::MEDIUM->value,
                        'points' => 4,
                        'answers' => [
                            ['text' => 'Utiliser des Security Groups et des clés SSH', 'correct' => true],
                            ['text' => 'Désactiver tous les ports', 'correct' => false],
                            ['text' => 'Utiliser uniquement des mots de passe forts', 'correct' => false],
                            ['text' => 'Installer un antivirus', 'correct' => false]
                        ]
                    ],
                    [
                        'question' => 'Quelle est la différence entre EBS et S3 ?',
                        'difficulty' => QuestionDifficultyEnum::MEDIUM->value,
                        'points' => 4,
                        'answers' => [
                            ['text' => 'EBS est du stockage bloc attaché aux instances, S3 est du stockage objet', 'correct' => true],
                            ['text' => 'S3 est plus rapide que EBS', 'correct' => false],
                            ['text' => 'EBS est gratuit, S3 est payant', 'correct' => false],
                            ['text' => 'Il n\'y a pas de différence', 'correct' => false]
                        ]
                    ]
                ]
            ],
            [
                'name' => 'CI/CD et Automatisation',
                'description' => 'Pipelines CI/CD, Jenkins, GitHub Actions, automatisation.',
                'questions' => [
                    [
                        'question' => 'Que signifie CI/CD ?',
                        'difficulty' => QuestionDifficultyEnum::EASY->value,
                        'points' => 2,
                        'answers' => [
                            ['text' => 'Continuous Integration / Continuous Deployment', 'correct' => true],
                            ['text' => 'Code Integration / Code Deployment', 'correct' => false],
                            ['text' => 'Container Integration / Container Distribution', 'correct' => false],
                            ['text' => 'Central Integration / Central Distribution', 'correct' => false]
                        ]
                    ],
                    [
                        'question' => 'Quelles sont les étapes typiques d\'un pipeline CI/CD ?',
                        'difficulty' => QuestionDifficultyEnum::MEDIUM->value,
                        'points' => 3,
                        'answers' => [
                            ['text' => 'Source, Build, Test, Deploy', 'correct' => true],
                            ['text' => 'Code, Commit, Push', 'correct' => false],
                            ['text' => 'Plan, Code, Release', 'correct' => false],
                            ['text' => 'Design, Develop, Debug', 'correct' => false]
                        ]
                    ],
                    [
                        'question' => 'Qu\'est-ce qu\'un pipeline "as code" ?',
                        'difficulty' => QuestionDifficultyEnum::MEDIUM->value,
                        'points' => 4,
                        'answers' => [
                            ['text' => 'Définir le pipeline dans un fichier versionné (ex: Jenkinsfile, .github/workflows)', 'correct' => true],
                            ['text' => 'Écrire le pipeline directement en code source', 'correct' => false],
                            ['text' => 'Utiliser uniquement des outils en ligne de commande', 'correct' => false],
                            ['text' => 'Compiler le pipeline avant exécution', 'correct' => false]
                        ]
                    ],
                    [
                        'question' => 'Quel est l\'avantage principal des tests automatisés dans CI/CD ?',
                        'difficulty' => QuestionDifficultyEnum::MEDIUM->value,
                        'points' => 3,
                        'answers' => [
                            ['text' => 'Détection rapide des régressions et bugs', 'correct' => true],
                            ['text' => 'Réduction du coût des serveurs', 'correct' => false],
                            ['text' => 'Amélioration de l\'interface utilisateur', 'correct' => false],
                            ['text' => 'Augmentation de la vitesse de déploiement uniquement', 'correct' => false]
                        ]
                    ],
                    [
                        'question' => 'Qu\'est-ce que le "Blue-Green Deployment" ?',
                        'difficulty' => QuestionDifficultyEnum::HARD->value,
                        'points' => 6,
                        'answers' => [
                            ['text' => 'Maintenir deux environnements identiques et basculer le trafic', 'correct' => true],
                            ['text' => 'Utiliser des serveurs bleus pour le dév et verts pour la prod', 'correct' => false],
                            ['text' => 'Déployer alternativement sur deux data centers', 'correct' => false],
                            ['text' => 'Avoir deux versions du code en parallèle', 'correct' => false]
                        ]
                    ]
                ]
            ]
        ];

        $this->createChaptersWithQuestions($certification, $chapters);
    }

    private function seedPythonAICertification(): void
    {
        $certification = Certification::where('slug', 'certification-python-ai-ml-data-scientist')->first();
        if (!$certification) return;

        $chapters = [
            [
                'name' => 'Python pour la Data Science',
                'description' => 'NumPy, Pandas, Matplotlib, manipulation de données.',
                'questions' => [
                    [
                        'question' => 'Quelle bibliothèque Python est optimale pour les calculs numériques ?',
                        'difficulty' => QuestionDifficultyEnum::EASY->value,
                        'points' => 2,
                        'answers' => [
                            ['text' => 'NumPy', 'correct' => true],
                            ['text' => 'Pandas', 'correct' => false],
                            ['text' => 'Matplotlib', 'correct' => false],
                            ['text' => 'Scikit-learn', 'correct' => false]
                        ]
                    ],
                    [
                        'question' => 'Comment créer un array NumPy à partir d\'une liste Python ?',
                        'difficulty' => QuestionDifficultyEnum::EASY->value,
                        'points' => 2,
                        'answers' => [
                            ['text' => 'np.array([1, 2, 3])', 'correct' => true],
                            ['text' => 'np.create([1, 2, 3])', 'correct' => false],
                            ['text' => 'np.from_list([1, 2, 3])', 'correct' => false],
                            ['text' => 'numpy([1, 2, 3])', 'correct' => false]
                        ]
                    ],
                    [
                        'question' => 'Quelle méthode Pandas utiliser pour lire un fichier CSV ?',
                        'difficulty' => QuestionDifficultyEnum::EASY->value,
                        'points' => 2,
                        'answers' => [
                            ['text' => 'pd.read_csv("file.csv")', 'correct' => true],
                            ['text' => 'pd.load_csv("file.csv")', 'correct' => false],
                            ['text' => 'pd.import_csv("file.csv")', 'correct' => false],
                            ['text' => 'pd.csv_read("file.csv")', 'correct' => false]
                        ]
                    ],
                    [
                        'question' => 'Comment sélectionner une colonne dans un DataFrame Pandas ?',
                        'difficulty' => QuestionDifficultyEnum::EASY->value,
                        'points' => 2,
                        'answers' => [
                            ['text' => 'df["nom_colonne"] ou df.nom_colonne', 'correct' => true],
                            ['text' => 'df.get("nom_colonne")', 'correct' => false],
                            ['text' => 'df.select("nom_colonne")', 'correct' => false],
                            ['text' => 'df.column("nom_colonne")', 'correct' => false]
                        ]
                    ],
                    [
                        'question' => 'Quelle fonction utiliser pour obtenir des statistiques descriptives d\'un DataFrame ?',
                        'difficulty' => QuestionDifficultyEnum::MEDIUM->value,
                        'points' => 3,
                        'answers' => [
                            ['text' => 'df.describe()', 'correct' => true],
                            ['text' => 'df.stats()', 'correct' => false],
                            ['text' => 'df.summary()', 'correct' => false],
                            ['text' => 'df.info()', 'correct' => false]
                        ]
                    ],
                    [
                        'question' => 'Comment gérer les valeurs manquantes dans Pandas ?',
                        'difficulty' => QuestionDifficultyEnum::MEDIUM->value,
                        'points' => 4,
                        'answers' => [
                            ['text' => 'df.dropna() pour supprimer, df.fillna() pour remplir', 'correct' => true],
                            ['text' => 'df.remove_nan() et df.replace_nan()', 'correct' => false],
                            ['text' => 'df.clean() et df.fill()', 'correct' => false],
                            ['text' => 'df.delete_missing() et df.add_values()', 'correct' => false]
                        ]
                    ]
                ]
            ],
            [
                'name' => 'Machine Learning Supervissé',
                'description' => 'Algorithmes supervissés, classification, régression.',
                'questions' => [
                    [
                        'question' => 'Quelle est la différence entre classification et régression ?',
                        'difficulty' => QuestionDifficultyEnum::MEDIUM->value,
                        'points' => 3,
                        'answers' => [
                            ['text' => 'Classification prédit des catégories, régression prédit des valeurs continues', 'correct' => true],
                            ['text' => 'Classification prédit des valeurs continues, régression prédit des catégories', 'correct' => false],
                            ['text' => 'Aucune différence, ce sont des synonymes', 'correct' => false],
                            ['text' => 'Classification utilise plus de données que régression', 'correct' => false]
                        ]
                    ],
                    [
                        'question' => 'Quel algorithme utiliser pour une régression linéaire simple ?',
                        'difficulty' => QuestionDifficultyEnum::EASY->value,
                        'points' => 2,
                        'answers' => [
                            ['text' => 'LinearRegression de scikit-learn', 'correct' => true],
                            ['text' => 'LogisticRegression', 'correct' => false],
                            ['text' => 'RandomForestRegressor', 'correct' => false],
                            ['text' => 'SVC', 'correct' => false]
                        ]
                    ],
                    [
                        'question' => 'Comment diviser un dataset en train/test avec scikit-learn ?',
                        'difficulty' => QuestionDifficultyEnum::MEDIUM->value,
                        'points' => 3,
                        'answers' => [
                            ['text' => 'train_test_split(X, y, test_size=0.2)', 'correct' => true],
                            ['text' => 'split_data(X, y, ratio=0.8)', 'correct' => false],
                            ['text' => 'divide_dataset(X, y, train=0.8)', 'correct' => false],
                            ['text' => 'separate_data(X, y, test=0.2)', 'correct' => false]
                        ]
                    ],
                    [
                        'question' => 'Quelle métrique utiliser pour évaluer un modèle de classification ?',
                        'difficulty' => QuestionDifficultyEnum::MEDIUM->value,
                        'points' => 4,
                        'answers' => [
                            ['text' => 'Accuracy, Precision, Recall, F1-score', 'correct' => true],
                            ['text' => 'MSE, RMSE, MAE', 'correct' => false],
                            ['text' => 'R², Adjusted R²', 'correct' => false],
                            ['text' => 'AUC uniquement', 'correct' => false]
                        ]
                    ],
                    [
                        'question' => 'Qu\'est-ce que l\'overfitting en machine learning ?',
                        'difficulty' => QuestionDifficultyEnum::MEDIUM->value,
                        'points' => 4,
                        'answers' => [
                            ['text' => 'Le modèle apprend trop les détails du training set et généralise mal', 'correct' => true],
                            ['text' => 'Le modèle n\'apprend pas assez les données d\'entraînement', 'correct' => false],
                            ['text' => 'Le modèle utilise trop de mémoire', 'correct' => false],
                            ['text' => 'Le modèle prend trop de temps à s\'entraîner', 'correct' => false]
                        ]
                    ],
                    [
                        'question' => 'Comment prévenir l\'overfitting ?',
                        'difficulty' => QuestionDifficultyEnum::HARD->value,
                        'points' => 5,
                        'answers' => [
                            ['text' => 'Cross-validation, régularisation, plus de données, early stopping', 'correct' => true],
                            ['text' => 'Utiliser plus de features', 'correct' => false],
                            ['text' => 'Augmenter la complexity du modèle', 'correct' => false],
                            ['text' => 'Réduire le nombre d\'epochs', 'correct' => false]
                        ]
                    ]
                ]
            ],
            [
                'name' => 'Deep Learning et Réseaux de Neurones',
                'description' => 'TensorFlow, Keras, CNN, RNN, architectures profondes.',
                'questions' => [
                    [
                        'question' => 'Quel framework est couramment utilisé pour le deep learning en Python ?',
                        'difficulty' => QuestionDifficultyEnum::EASY->value,
                        'points' => 2,
                        'answers' => [
                            ['text' => 'TensorFlow', 'correct' => true],
                            ['text' => 'PyTorch', 'correct' => true],
                            ['text' => 'Scikit-learn', 'correct' => false],
                            ['text' => 'Pandas', 'correct' => false]
                        ]
                    ],
                    [
                        'question' => 'Qu\'est-ce qu\'un neurone artificiel ?',
                        'difficulty' => QuestionDifficultyEnum::MEDIUM->value,
                        'points' => 3,
                        'answers' => [
                            ['text' => 'Une unité de calcul qui applique une fonction d\'activation à une somme pondérée', 'correct' => true],
                            ['text' => 'Un algorithme de tri des données', 'correct' => false],
                            ['text' => 'Une méthode de compression d\'images', 'correct' => false],
                            ['text' => 'Un type de base de données', 'correct' => false]
                        ]
                    ],
                    [
                        'question' => 'Quelle est la fonction d\'activation la plus courante en deep learning ?',
                        'difficulty' => QuestionDifficultyEnum::MEDIUM->value,
                        'points' => 3,
                        'answers' => [
                            ['text' => 'ReLU (Rectified Linear Unit)', 'correct' => true],
                            ['text' => 'Sigmoid', 'correct' => false],
                            ['text' => 'Tanh', 'correct' => false],
                            ['text' => 'Linear', 'correct' => false]
                        ]
                    ],
                    [
                        'question' => 'Qu\'est-ce qu\'un CNN (Convolutional Neural Network) ?',
                        'difficulty' => QuestionDifficultyEnum::MEDIUM->value,
                        'points' => 4,
                        'answers' => [
                            ['text' => 'Réseau de neurones spécialisé pour le traitement d\'images', 'correct' => true],
                            ['text' => 'Réseau pour traiter les séquences temporelles', 'correct' => false],
                            ['text' => 'Réseau pour la classification de texte uniquement', 'correct' => false],
                            ['text' => 'Réseau pour les données tabulaires', 'correct' => false]
                        ]
                    ],
                    [
                        'question' => 'Que fait une couche de pooling dans un CNN ?',
                        'difficulty' => QuestionDifficultyEnum::HARD->value,
                        'points' => 5,
                        'answers' => [
                            ['text' => 'Réduit la taille spatiale des feature maps', 'correct' => true],
                            ['text' => 'Augmente le nombre de filtres', 'correct' => false],
                            ['text' => 'Applique une fonction d\'activation', 'correct' => false],
                            ['text' => 'Normalise les données d\'entrée', 'correct' => false]
                        ]
                    ],
                    [
                        'question' => 'Comment créer un modèle séquentiel avec Keras ?',
                        'difficulty' => QuestionDifficultyEnum::MEDIUM->value,
                        'points' => 3,
                        'answers' => [
                            ['text' => 'model = Sequential([layers...])', 'correct' => true],
                            ['text' => 'model = Model([layers...])', 'correct' => false],
                            ['text' => 'model = Network([layers...])', 'correct' => false],
                            ['text' => 'model = NeuralNet([layers...])', 'correct' => false]
                        ]
                    ]
                ]
            ],
            [
                'name' => 'Déploiement de Modèles IA',
                'description' => 'MLOps, APIs, conteneurisation, monitoring de modèles.',
                'questions' => [
                    [
                        'question' => 'Que signifie MLOps ?',
                        'difficulty' => QuestionDifficultyEnum::MEDIUM->value,
                        'points' => 3,
                        'answers' => [
                            ['text' => 'Machine Learning Operations', 'correct' => true],
                            ['text' => 'Model Learning Optimization', 'correct' => false],
                            ['text' => 'Multiple Learning Operations', 'correct' => false],
                            ['text' => 'Machine Logic Operations', 'correct' => false]
                        ]
                    ],
                    [
                        'question' => 'Quel framework utiliser pour créer une API REST en Python ?',
                        'difficulty' => QuestionDifficultyEnum::EASY->value,
                        'points' => 2,
                        'answers' => [
                            ['text' => 'Flask ou FastAPI', 'correct' => true],
                            ['text' => 'NumPy', 'correct' => false],
                            ['text' => 'Matplotlib', 'correct' => false],
                            ['text' => 'Scikit-learn', 'correct' => false]
                        ]
                    ],
                    [
                        'question' => 'Comment sérialiser un modèle scikit-learn pour le déploiement ?',
                        'difficulty' => QuestionDifficultyEnum::MEDIUM->value,
                        'points' => 4,
                        'answers' => [
                            ['text' => 'Utiliser pickle ou joblib', 'correct' => true],
                            ['text' => 'Utiliser JSON', 'correct' => false],
                            ['text' => 'Utiliser CSV', 'correct' => false],
                            ['text' => 'Sauvegarder le code source uniquement', 'correct' => false]
                        ]
                    ],
                    [
                        'question' => 'Qu\'est-ce que le model drift ?',
                        'difficulty' => QuestionDifficultyEnum::HARD->value,
                        'points' => 5,
                        'answers' => [
                            ['text' => 'Dégradation des performances du modèle due aux changements des données', 'correct' => true],
                            ['text' => 'Déplacement physique du serveur de modèle', 'correct' => false],
                            ['text' => 'Erreur de calcul dans le modèle', 'correct' => false],
                            ['text' => 'Perte de connexion avec la base de données', 'correct' => false]
                        ]
                    ],
                    [
                        'question' => 'Comment monitorer un modèle ML en production ?',
                        'difficulty' => QuestionDifficultyEnum::HARD->value,
                        'points' => 6,
                        'answers' => [
                            ['text' => 'Surveiller les métriques de performance, la distribution des données, la latence', 'correct' => true],
                            ['text' => 'Vérifier uniquement l\'utilisation CPU', 'correct' => false],
                            ['text' => 'Logger les erreurs d\'exécution uniquement', 'correct' => false],
                            ['text' => 'Tester manuellement chaque prédiction', 'correct' => false]
                        ]
                    ],
                    [
                        'question' => 'Qu\'est-ce que le A/B testing pour les modèles ML ?',
                        'difficulty' => QuestionDifficultyEnum::MEDIUM->value,
                        'points' => 4,
                        'answers' => [
                            ['text' => 'Comparer les performances de deux versions de modèles en parallèle', 'correct' => true],
                            ['text' => 'Tester le modèle sur deux datasets différents', 'correct' => false],
                            ['text' => 'Utiliser deux algorithmes différents pour l\'entraînement', 'correct' => false],
                            ['text' => 'Diviser le dataset en deux parties égales', 'correct' => false]
                        ]
                    ]
                ]
            ]
        ];

        $this->createChaptersWithQuestions($certification, $chapters);
    }

    private function createChaptersWithQuestions(Certification $certification, array $chapters): void
    {
        foreach ($chapters as $index => $chapterData) {
            $chapter = Chapter::create([
                'certification_id' => $certification->id,
                'name' => $chapterData['name'],
                'description' => $chapterData['description'],
                'order' => $index + 1,
            ]);

            foreach ($chapterData['questions'] as $questionData) {
                // Format answers with proper id structure
                $formattedAnswers = [];
                foreach ($questionData['answers'] as $answerIndex => $answer) {
                    $formattedAnswers[] = [
                        'id' => $answerIndex + 1,
                        'text' => $answer['text'],
                        'correct' => $answer['correct']
                    ];
                }

                Question::create([
                    'chapter_id' => $chapter->id,
                    'question' => $questionData['question'],
                    'answers' => $formattedAnswers,
                    'difficulty' => $questionData['difficulty'],
                    'type' => QuestionTypeEnum::CERTIFICATION->value,
                    'points' => $questionData['points'],
                ]);
            }
        }
    }
}
