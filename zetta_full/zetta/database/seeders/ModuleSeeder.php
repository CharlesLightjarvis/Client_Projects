<?php

namespace Database\Seeders;

use App\Models\Formation;
use App\Models\Module;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ModuleSeeder extends Seeder
{
    public function run()
    {
        $modulesData = [
            // Modules pour la formation React
            'react' => [
                [
                    'name' => 'Introduction à React et JSX',
                    'slug' => 'introduction-react-jsx',
                    'description' => 'Découverte de React, installation de l\'environnement de développement, premiers pas avec JSX et création de composants de base.'
                ],
                [
                    'name' => 'Composants et Props',
                    'slug' => 'composants-props',
                    'description' => 'Création et utilisation de composants React, passage de données via les props, composition de composants.'
                ],
                [
                    'name' => 'State et Hooks',
                    'slug' => 'state-hooks',
                    'description' => 'Gestion de l\'état local avec useState, useEffect pour les effets de bord, et introduction aux hooks personnalisés.'
                ],
                [
                    'name' => 'Gestion d\'état avancée',
                    'slug' => 'gestion-etat-avancee',
                    'description' => 'Context API, useReducer, Redux Toolkit pour la gestion d\'état global dans les applications complexes.'
                ],
                [
                    'name' => 'Routing et Navigation',
                    'slug' => 'routing-navigation',
                    'description' => 'Mise en place du routing avec React Router, navigation programmatique, protection de routes.'
                ],
                [
                    'name' => 'Optimisation et Déploiement',
                    'slug' => 'optimisation-deploiement',
                    'description' => 'Techniques d\'optimisation, lazy loading, mémorisation, et déploiement sur différentes plateformes.'
                ]
            ],
            // Modules pour la formation DevOps
            'devops' => [
                [
                    'name' => 'Fondamentaux DevOps et Culture',
                    'slug' => 'fondamentaux-devops-culture',
                    'description' => 'Introduction aux principes DevOps, culture collaborative, méthodologies agiles et transformation digitale.'
                ],
                [
                    'name' => 'Conteneurisation avec Docker',
                    'slug' => 'conteneurisation-docker',
                    'description' => 'Maîtrise de Docker : images, conteneurs, Dockerfile, Docker Compose, registres et bonnes pratiques.'
                ],
                [
                    'name' => 'Orchestration avec Kubernetes',
                    'slug' => 'orchestration-kubernetes',
                    'description' => 'Déploiement et gestion d\'applications avec Kubernetes : pods, services, deployments, ingress.'
                ],
                [
                    'name' => 'Infrastructure AWS',
                    'slug' => 'infrastructure-aws',
                    'description' => 'Services AWS essentiels : EC2, S3, RDS, VPC, IAM, CloudFormation pour l\'infrastructure cloud.'
                ],
                [
                    'name' => 'CI/CD et Automatisation',
                    'slug' => 'cicd-automatisation',
                    'description' => 'Pipelines CI/CD avec Jenkins, GitHub Actions, automatisation des tests et déploiements.'
                ],
                [
                    'name' => 'Infrastructure as Code',
                    'slug' => 'infrastructure-as-code',
                    'description' => 'Terraform, Ansible, CloudFormation pour automatiser la création et gestion d\'infrastructure.'
                ],
                [
                    'name' => 'Monitoring et Observabilité',
                    'slug' => 'monitoring-observabilite',
                    'description' => 'Surveillance des applications avec Prometheus, Grafana, ELK Stack, alerting et métriques.'
                ]
            ],
            // Modules pour la formation Python IA
            'python-ia' => [
                [
                    'name' => 'Python pour la Data Science',
                    'slug' => 'python-data-science',
                    'description' => 'Maîtrise des bibliothèques essentielles : NumPy, Pandas, Matplotlib pour la manipulation et visualisation de données.'
                ],
                [
                    'name' => 'Statistiques et Analyse Exploratoire',
                    'slug' => 'statistiques-analyse-exploratoire',
                    'description' => 'Statistiques descriptives, tests d\'hypothèses, analyse exploratoire des données et préparation des datasets.'
                ],
                [
                    'name' => 'Machine Learning Supervissé',
                    'slug' => 'machine-learning-supervise',
                    'description' => 'Algorithmes de classification et régression avec Scikit-learn : SVM, Random Forest, régression logistique.'
                ],
                [
                    'name' => 'Machine Learning Non-Supervissé',
                    'slug' => 'machine-learning-non-supervise',
                    'description' => 'Clustering, réduction de dimensionnalité, détection d\'anomalies avec K-means, PCA, DBSCAN.'
                ],
                [
                    'name' => 'Réseaux de Neurones et Deep Learning',
                    'slug' => 'reseaux-neurones-deep-learning',
                    'description' => 'Introduction au deep learning avec TensorFlow/Keras : réseaux de neurones, CNN, RNN.'
                ],
                [
                    'name' => 'Traitement du Langage Naturel (NLP)',
                    'slug' => 'traitement-langage-naturel',
                    'description' => 'Techniques NLP : tokenisation, analyse de sentiment, modèles de langage, transformers.'
                ],
                [
                    'name' => 'Vision par Ordinateur',
                    'slug' => 'vision-ordinateur',
                    'description' => 'Traitement d\'images, détection d\'objets, reconnaissance faciale avec OpenCV et deep learning.'
                ],
                [
                    'name' => 'Déploiement de Modèles IA',
                    'slug' => 'deploiement-modeles-ia',
                    'description' => 'MLOps, déploiement de modèles avec Flask/FastAPI, Docker, monitoring des performances en production.'
                ]
            ]
        ];

        // Récupérer les formations
        $reactFormation = Formation::where('slug', 'formation-complete-reactjs-debutant-expert')->first();
        $devopsFormation = Formation::where('slug', 'devops-infrastructure-cloud-aws-docker')->first();
        $pythonFormation = Formation::where('slug', 'python-intelligence-artificielle-machine-learning')->first();

        // Créer les modules et les associer aux formations
        $formations = [
            'react' => $reactFormation,
            'devops' => $devopsFormation,
            'python-ia' => $pythonFormation
        ];

        foreach ($modulesData as $formationType => $modules) {
            $formation = $formations[$formationType];
            if ($formation) {
                foreach ($modules as $moduleData) {
                    $module = Module::create([
                        'name' => $moduleData['name'],
                        'slug' => $moduleData['slug'],
                        'description' => $moduleData['description'],
                    ]);
                    
                    // Associer le module à la formation
                    $formation->modules()->attach($module->id);
                }
            }
        }
    }
}
