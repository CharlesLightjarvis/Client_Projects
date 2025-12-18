<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Formation;
use App\Enums\LevelEnum;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class FormationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        $formations = [
            [
                'name' => 'Formation complète React.js - Du débutant à l\'expert',
                'slug' => 'formation-complete-reactjs-debutant-expert',
                'description' => 'Apprenez React.js de A à Z avec une approche pratique. Cette formation couvre tous les concepts essentiels : composants, hooks, gestion d\'état, routing, et bien plus. Vous développerez plusieurs projets concrets pour maîtriser cette bibliothèque JavaScript incontournable.',
                'level' => LevelEnum::BEGINNER->value,
                'duration' => 40,
                'price' => 1200,
                'discount_price' => 899,
                'category' => 'Développement web',
                'prerequisites' => [
                    'Connaissances de base en HTML, CSS et JavaScript',
                    'Familiarité avec ES6+',
                    'Notions de développement web'
                ],
                'objectives' => [
                    'Maîtriser les concepts fondamentaux de React.js',
                    'Créer des applications React modernes et performantes',
                    'Gérer l\'état avec Redux et Context API',
                    'Implémenter le routing avec React Router',
                    'Déployer des applications React en production'
                ]
            ],
            [
                'name' => 'DevOps et Infrastructure Cloud - AWS & Docker',
                'slug' => 'devops-infrastructure-cloud-aws-docker',
                'description' => 'Formation complète sur les pratiques DevOps modernes avec un focus sur AWS et la conteneurisation. Apprenez à automatiser vos déploiements, gérer vos infrastructures as code, et optimiser vos pipelines CI/CD.',
                'level' => LevelEnum::INTERMEDIATE->value,
                'duration' => 50,
                'price' => 1800,
                'discount_price' => 1399,
                'category' => 'Devops',
                'prerequisites' => [
                    'Expérience en développement logiciel',
                    'Connaissances des systèmes Linux',
                    'Notions de base en réseau',
                    'Familiarité avec Git'
                ],
                'objectives' => [
                    'Maîtriser les outils DevOps essentiels (Docker, Kubernetes, Jenkins)',
                    'Automatiser les déploiements avec des pipelines CI/CD',
                    'Gérer l\'infrastructure AWS (EC2, S3, RDS, Lambda)',
                    'Implémenter l\'Infrastructure as Code avec Terraform',
                    'Monitorer et optimiser les performances des applications'
                ]
            ],
            [
                'name' => 'Python pour l\'Intelligence Artificielle et Machine Learning',
                'slug' => 'python-intelligence-artificielle-machine-learning',
                'description' => 'Découvrez le monde de l\'IA avec Python ! Cette formation vous apprendra à utiliser les bibliothèques essentielles comme NumPy, Pandas, Scikit-learn et TensorFlow pour créer des modèles d\'apprentissage automatique et des réseaux de neurones.',
                'level' => LevelEnum::INTERMEDIATE->value,
                'duration' => 60,
                'price' => 2200,
                'discount_price' => 1699,
                'category' => 'Intelligence Artificielle',
                'prerequisites' => [
                    'Connaissances solides en Python',
                    'Bases en mathématiques (algèbre linéaire, statistiques)',
                    'Notions d\'algorithmique',
                    'Curiosité pour l\'analyse de données'
                ],
                'objectives' => [
                    'Maîtriser les bibliothèques Python pour la data science',
                    'Créer et entraîner des modèles de machine learning',
                    'Développer des réseaux de neurones avec TensorFlow/Keras',
                    'Traiter et analyser des données massives',
                    'Déployer des modèles IA en production'
                ]
            ]
        ];

        foreach ($formations as $formationData) {
            $category = Category::where('name', $formationData['category'])->first();
            
            Formation::create([
                'name' => $formationData['name'],
                'slug' => $formationData['slug'],
                'description' => $formationData['description'],
                'level' => $formationData['level'],
                'duration' => $formationData['duration'],
                'price' => $formationData['price'],
                'discount_price' => $formationData['discount_price'],
                'category_id' => $category->id,
                'prerequisites' => $formationData['prerequisites'],
                'objectives' => $formationData['objectives'],
            ]);
        }
    }
}
