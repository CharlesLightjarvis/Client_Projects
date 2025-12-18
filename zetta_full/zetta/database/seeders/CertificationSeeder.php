<?php

namespace Database\Seeders;

use App\Models\Certification;
use App\Models\Formation;
use App\Enums\LevelEnum;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CertificationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        $certificationsData = [
            [
                'formation_slug' => 'formation-complete-reactjs-debutant-expert',
                'name' => 'Certification React.js Développeur Professionnel',
                'slug' => 'certification-reactjs-developpeur-professionnel',
                'description' => 'Cette certification valide vos compétences en développement d\'applications React.js modernes. Elle couvre les concepts fondamentaux, la gestion d\'état, le routing, l\'optimisation des performances et les bonnes pratiques de développement.',
                'provider' => 'Zetta Academy',
                'validity_period' => 3,
                'level' => LevelEnum::INTERMEDIATE->value,
                'benefits' => [
                    'Reconnaissance officielle de vos compétences React.js',
                    'Amélioration de votre profil professionnel',
                    'Accès à la communauté des développeurs certifiés',
                    'Mise à jour continue des connaissances'
                ],
                'skills' => [
                    'Développement de composants React réutilisables',
                    'Gestion d\'état avec Redux et Context API',
                    'Implémentation du routing avec React Router',
                    'Optimisation des performances des applications',
                    'Tests unitaires et d\'intégration',
                    'Déploiement d\'applications en production'
                ],
                'best_for' => [
                    'Développeurs JavaScript souhaitant se spécialiser en React',
                    'Développeurs frontend cherchant à valider leurs compétences',
                    'Professionnels visant une promotion ou un changement de poste',
                    'Freelances souhaitant renforcer leur crédibilité'
                ],
                'prerequisites' => [
                    'Solides connaissances en JavaScript ES6+',
                    'Expérience en développement web (HTML, CSS)',
                    'Familiarité avec les outils de développement modernes',
                    'Compréhension des concepts de programmation orientée objet'
                ]
            ],
            [
                'formation_slug' => 'devops-infrastructure-cloud-aws-docker',
                'name' => 'Certification DevOps Engineer AWS Specialist',
                'slug' => 'certification-devops-engineer-aws-specialist',
                'description' => 'Certification professionnelle validant l\'expertise en pratiques DevOps avec un focus sur AWS et la conteneurisation. Couvre l\'automatisation, l\'infrastructure as code, les pipelines CI/CD et le monitoring.',
                'provider' => 'Zetta Academy',
                'validity_period' => 2,
                'level' => LevelEnum::ADVANCED->value,
                'benefits' => [
                    'Certification reconnue par l\'industrie',
                    'Augmentation significative du potentiel salarial',
                    'Accès aux opportunités de postes senior',
                    'Réseau professionnel DevOps étendu'
                ],
                'skills' => [
                    'Automatisation des déploiements avec CI/CD',
                    'Gestion d\'infrastructure AWS (EC2, S3, RDS, Lambda)',
                    'Containerisation avec Docker et orchestration Kubernetes',
                    'Infrastructure as Code avec Terraform',
                    'Monitoring et observabilité des systèmes',
                    'Sécurité et bonnes pratiques DevOps'
                ],
                'best_for' => [
                    'Administrateurs système évoluant vers DevOps',
                    'Développeurs souhaitant acquérir des compétences d\'infrastructure',
                    'Architectes cloud cherchant une spécialisation AWS',
                    'Professionnels IT visant des rôles de leadership technique'
                ],
                'prerequisites' => [
                    'Expérience en administration système Linux',
                    'Connaissances de base des réseaux informatiques',
                    'Familiarité avec les concepts cloud',
                    'Expérience en scripting (Bash, Python)'
                ]
            ],
            [
                'formation_slug' => 'python-intelligence-artificielle-machine-learning',
                'name' => 'Certification Python AI/ML Data Scientist',
                'slug' => 'certification-python-ai-ml-data-scientist',
                'description' => 'Certification avancée en science des données et intelligence artificielle avec Python. Valide les compétences en machine learning, deep learning, traitement du langage naturel et déploiement de modèles IA.',
                'provider' => 'Zetta Academy',
                'validity_period' => 2,
                'level' => LevelEnum::ADVANCED->value,
                'benefits' => [
                    'Reconnaissance en tant qu\'expert IA/ML',
                    'Accès aux postes de Data Scientist senior',
                    'Participation à des projets d\'innovation technologique',
                    'Réseau professionnel dans l\'écosystème IA'
                ],
                'skills' => [
                    'Analyse et préparation de données avec Pandas/NumPy',
                    'Développement de modèles ML avec Scikit-learn',
                    'Création de réseaux de neurones avec TensorFlow/Keras',
                    'Traitement du langage naturel (NLP)',
                    'Vision par ordinateur et traitement d\'images',
                    'Déploiement de modèles IA en production (MLOps)'
                ],
                'best_for' => [
                    'Développeurs Python souhaitant se spécialiser en IA',
                    'Analystes de données évoluant vers le machine learning',
                    'Chercheurs académiques transitioning vers l\'industrie',
                    'Professionnels cherchant à intégrer l\'IA dans leur domaine'
                ],
                'prerequisites' => [
                    'Maîtrise avancée de Python',
                    'Solides bases en mathématiques et statistiques',
                    'Expérience en analyse de données',
                    'Compréhension des algorithmes et structures de données'
                ]
            ]
        ];

        foreach ($certificationsData as $certData) {
            $formation = Formation::where('slug', $certData['formation_slug'])->first();
            
            if ($formation) {
                $certification = Certification::create([
                    'name' => $certData['name'],
                    'slug' => $certData['slug'],
                    'description' => $certData['description'],
                    'provider' => $certData['provider'],
                    'validity_period' => $certData['validity_period'],
                    'level' => $certData['level'],
                    'benefits' => $certData['benefits'],
                    'skills' => $certData['skills'],
                    'best_for' => $certData['best_for'],
                    'prerequisites' => $certData['prerequisites'],
                ]);
                
                // Link certification to formation
                $formation->certifications()->attach($certification->id);
            }
        }
    }
}
