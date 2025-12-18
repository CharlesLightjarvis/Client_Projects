<?php

namespace Database\Seeders;

use App\Models\Lesson;
use App\Models\Module;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class LessonSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        $lessonsData = [
            // Leçons pour "Introduction à React et JSX"
            'introduction-react-jsx' => [
                ['name' => 'Qu\'est-ce que React ?', 'duration' => 1, 'description' => 'Histoire et avantages de React, comparaison avec d\'autres frameworks.'],
                ['name' => 'Installation et configuration de l\'environnement', 'duration' => 2, 'description' => 'Node.js, npm/yarn, Create React App, VS Code et extensions.'],
                ['name' => 'Premiers pas avec JSX', 'duration' => 2, 'description' => 'Syntaxe JSX, différences avec HTML, expressions JavaScript dans JSX.'],
                ['name' => 'Structure d\'un projet React', 'duration' => 1, 'description' => 'Organisation des fichiers, conventions de nommage, imports/exports.'],
                ['name' => 'Premier composant React', 'duration' => 2, 'description' => 'Création d\'un composant simple, rendu dans le DOM.']
            ],
            // Leçons pour "Composants et Props"
            'composants-props' => [
                ['name' => 'Composants fonctionnels vs composants classe', 'duration' => 2, 'description' => 'Différences et bonnes pratiques modernes.'],
                ['name' => 'Passage de props', 'duration' => 2, 'description' => 'Transmission de données entre composants parents et enfants.'],
                ['name' => 'Props par défaut et PropTypes', 'duration' => 1, 'description' => 'Validation et valeurs par défaut des props.'],
                ['name' => 'Composition de composants', 'duration' => 2, 'description' => 'Réutilisabilité et architecture modulaire.'],
                ['name' => 'Children et slots', 'duration' => 1, 'description' => 'Utilisation de props.children pour la composition.']
            ],
            // Leçons pour "State et Hooks"
            'state-hooks' => [
                ['name' => 'Introduction au state', 'duration' => 2, 'description' => 'Concept d\'état local, mutabilité et re-rendu.'],
                ['name' => 'Hook useState', 'duration' => 3, 'description' => 'Gestion de l\'état avec useState, bonnes pratiques.'],
                ['name' => 'Hook useEffect', 'duration' => 3, 'description' => 'Effets de bord, lifecycle, nettoyage et dépendances.'],
                ['name' => 'Autres hooks essentiels', 'duration' => 2, 'description' => 'useContext, useRef, useMemo, useCallback.'],
                ['name' => 'Hooks personnalisés', 'duration' => 2, 'description' => 'Création de hooks réutilisables.']
            ],
            // Leçons pour "Gestion d'état avancée"
            'gestion-etat-avancee' => [
                ['name' => 'Context API', 'duration' => 3, 'description' => 'Partage d\'état global sans prop drilling.'],
                ['name' => 'useReducer pour la logique complexe', 'duration' => 2, 'description' => 'Gestion d\'état avec des réducteurs.'],
                ['name' => 'Introduction à Redux', 'duration' => 3, 'description' => 'Principes et architecture Redux.'],
                ['name' => 'Redux Toolkit', 'duration' => 3, 'description' => 'Approche moderne et simplifiée de Redux.'],
                ['name' => 'Async actions et middleware', 'duration' => 2, 'description' => 'Gestion des appels API avec Redux Thunk.']
            ],
            // Leçons pour "Routing et Navigation"
            'routing-navigation' => [
                ['name' => 'Installation et configuration de React Router', 'duration' => 1, 'description' => 'Setup et premiers pas avec React Router.'],
                ['name' => 'Routes et composants de navigation', 'duration' => 2, 'description' => 'BrowserRouter, Route, Link, NavLink.'],
                ['name' => 'Paramètres et query strings', 'duration' => 2, 'description' => 'Routes dynamiques et passage de paramètres.'],
                ['name' => 'Navigation programmatique', 'duration' => 1, 'description' => 'useNavigate et redirection.'],
                ['name' => 'Protection de routes', 'duration' => 2, 'description' => 'Routes privées et authentification.']
            ],
            // Leçons pour "Optimisation et Déploiement"
            'optimisation-deploiement' => [
                ['name' => 'Optimisation des performances', 'duration' => 2, 'description' => 'React.memo, useMemo, useCallback.'],
                ['name' => 'Lazy loading et code splitting', 'duration' => 2, 'description' => 'Chargement à la demande des composants.'],
                ['name' => 'Build et optimisation de production', 'duration' => 1, 'description' => 'Configuration de build pour la production.'],
                ['name' => 'Déploiement sur Netlify/Vercel', 'duration' => 2, 'description' => 'Déploiement automatique et CI/CD.'],
                ['name' => 'Bonnes pratiques et debugging', 'duration' => 1, 'description' => 'Outils de développement et débogage.']
            ],

            // Leçons pour DevOps - "Fondamentaux DevOps et Culture"
            'fondamentaux-devops-culture' => [
                ['name' => 'Introduction au DevOps', 'duration' => 2, 'description' => 'Histoire, principes et avantages du mouvement DevOps.'],
                ['name' => 'Culture et collaboration', 'duration' => 2, 'description' => 'Transformation culturelle, communication Dev/Ops.'],
                ['name' => 'Méthodologies Agiles et DevOps', 'duration' => 1, 'description' => 'Intégration avec Scrum, Kanban.'],
                ['name' => 'KPIs et métriques DevOps', 'duration' => 2, 'description' => 'Mesure de la performance et amélioration continue.']
            ],
            // Leçons pour "Conteneurisation avec Docker"
            'conteneurisation-docker' => [
                ['name' => 'Introduction à Docker', 'duration' => 2, 'description' => 'Concepts de conteneurisation, avantages par rapport aux VMs.'],
                ['name' => 'Images et conteneurs', 'duration' => 3, 'description' => 'Création, gestion et exécution de conteneurs.'],
                ['name' => 'Dockerfile et bonnes pratiques', 'duration' => 3, 'description' => 'Création d\'images personnalisées, optimisation.'],
                ['name' => 'Docker Compose', 'duration' => 2, 'description' => 'Orchestration multi-conteneurs, environnements de développement.'],
                ['name' => 'Registres et déploiement', 'duration' => 2, 'description' => 'Docker Hub, registres privés, déploiement.']
            ],
            // Leçons pour "Orchestration avec Kubernetes"
            'orchestration-kubernetes' => [
                ['name' => 'Architecture Kubernetes', 'duration' => 2, 'description' => 'Clusters, nodes, control plane, concepts fondamentaux.'],
                ['name' => 'Pods et deployments', 'duration' => 3, 'description' => 'Déploiement et gestion d\'applications.'],
                ['name' => 'Services et networking', 'duration' => 2, 'description' => 'Exposition et communication entre services.'],
                ['name' => 'ConfigMaps et Secrets', 'duration' => 2, 'description' => 'Gestion de la configuration et des secrets.'],
                ['name' => 'Ingress et load balancing', 'duration' => 2, 'description' => 'Routage externe et équilibrage de charge.']
            ],
            // Leçons pour "Infrastructure AWS"
            'infrastructure-aws' => [
                ['name' => 'Introduction à AWS', 'duration' => 2, 'description' => 'Services principaux, console AWS, concepts de base.'],
                ['name' => 'EC2 et stockage', 'duration' => 3, 'description' => 'Instances virtuelles, EBS, S3.'],
                ['name' => 'Réseaux et sécurité', 'duration' => 3, 'description' => 'VPC, security groups, IAM.'],
                ['name' => 'Bases de données RDS', 'duration' => 2, 'description' => 'Gestion de bases de données relationnelles.'],
                ['name' => 'Services serverless', 'duration' => 2, 'description' => 'Lambda, API Gateway, services managés.']
            ],
            // Leçons pour "CI/CD et Automatisation"
            'cicd-automatisation' => [
                ['name' => 'Principes CI/CD', 'duration' => 2, 'description' => 'Intégration et déploiement continus.'],
                ['name' => 'Jenkins - Installation et configuration', 'duration' => 2, 'description' => 'Setup de Jenkins, plugins essentiels.'],
                ['name' => 'Pipelines Jenkins', 'duration' => 3, 'description' => 'Jenkinsfile, pipelines déclaratifs.'],
                ['name' => 'GitHub Actions', 'duration' => 3, 'description' => 'Workflows, actions, automatisation GitHub.'],
                ['name' => 'Tests automatisés et qualité', 'duration' => 2, 'description' => 'Intégration des tests, SonarQube.']
            ],
            // Leçons pour "Infrastructure as Code"
            'infrastructure-as-code' => [
                ['name' => 'Concepts IaC', 'duration' => 1, 'description' => 'Avantages et principes de l\'Infrastructure as Code.'],
                ['name' => 'Terraform - Bases', 'duration' => 3, 'description' => 'HCL, providers, ressources, état.'],
                ['name' => 'Terraform - Avancé', 'duration' => 3, 'description' => 'Modules, workspaces, remote state.'],
                ['name' => 'Ansible pour la configuration', 'duration' => 2, 'description' => 'Playbooks, inventaires, gestion des serveurs.'],
                ['name' => 'CloudFormation AWS', 'duration' => 2, 'description' => 'Templates, stacks, service natif AWS.']
            ],
            // Leçons pour "Monitoring et Observabilité"
            'monitoring-observabilite' => [
                ['name' => 'Principes de monitoring', 'duration' => 2, 'description' => 'Métriques, logs, traces, observabilité.'],
                ['name' => 'Prometheus et métriques', 'duration' => 3, 'description' => 'Collection et stockage de métriques.'],
                ['name' => 'Grafana et visualisation', 'duration' => 2, 'description' => 'Dashboards, alerting, visualisation.'],
                ['name' => 'ELK Stack pour les logs', 'duration' => 3, 'description' => 'Elasticsearch, Logstash, Kibana.'],
                ['name' => 'Alerting et incident response', 'duration' => 2, 'description' => 'Configuration d\'alertes, processus d\'escalade.']
            ],

            // Leçons pour Python IA - "Python pour la Data Science"
            'python-data-science' => [
                ['name' => 'Environnement Python pour la Data Science', 'duration' => 2, 'description' => 'Anaconda, Jupyter, environnements virtuels.'],
                ['name' => 'NumPy - Calcul numérique', 'duration' => 3, 'description' => 'Arrays, opérations vectorielles, algèbre linéaire.'],
                ['name' => 'Pandas - Manipulation de données', 'duration' => 4, 'description' => 'DataFrames, nettoyage, transformation, analyse.'],
                ['name' => 'Matplotlib et Seaborn', 'duration' => 3, 'description' => 'Visualisation de données, graphiques statistiques.'],
                ['name' => 'Introduction à SciPy', 'duration' => 2, 'description' => 'Fonctions scientifiques avancées.']
            ],
            // Leçons pour "Statistiques et Analyse Exploratoire"
            'statistiques-analyse-exploratoire' => [
                ['name' => 'Statistiques descriptives', 'duration' => 3, 'description' => 'Mesures de tendance centrale, dispersion, distribution.'],
                ['name' => 'Visualisation exploratoire', 'duration' => 2, 'description' => 'Histogrammes, box plots, scatter plots.'],
                ['name' => 'Tests statistiques', 'duration' => 3, 'description' => 'Tests d\'hypothèses, p-values, intervalles de confiance.'],
                ['name' => 'Corrélation et régression simple', 'duration' => 2, 'description' => 'Relations entre variables, régression linéaire.'],
                ['name' => 'Préparation des données', 'duration' => 3, 'description' => 'Nettoyage, gestion des valeurs manquantes, encodage.']
            ],
            // Leçons pour "Machine Learning Supervissé"
            'machine-learning-supervise' => [
                ['name' => 'Introduction au ML supervissé', 'duration' => 2, 'description' => 'Concepts, types de problèmes, évaluation.'],
                ['name' => 'Régression linéaire et logistique', 'duration' => 3, 'description' => 'Modèles linéaires, régularisation.'],
                ['name' => 'Arbres de décision et Random Forest', 'duration' => 3, 'description' => 'Algorithmes d\'ensemble, importance des features.'],
                ['name' => 'SVM et méthodes à noyau', 'duration' => 2, 'description' => 'Support Vector Machines, kernels.'],
                ['name' => 'Validation et sélection de modèles', 'duration' => 2, 'description' => 'Cross-validation, grid search, métriques.']
            ],
            // Leçons pour "Machine Learning Non-Supervissé"
            'machine-learning-non-supervise' => [
                ['name' => 'Clustering avec K-means', 'duration' => 3, 'description' => 'Algorithme K-means, choix du nombre de clusters.'],
                ['name' => 'Clustering hiérarchique et DBSCAN', 'duration' => 2, 'description' => 'Méthodes de clustering alternatives.'],
                ['name' => 'Réduction de dimensionnalité - PCA', 'duration' => 3, 'description' => 'Analyse en composantes principales.'],
                ['name' => 'T-SNE et UMAP', 'duration' => 2, 'description' => 'Visualisation de données haute dimension.'],
                ['name' => 'Détection d\'anomalies', 'duration' => 2, 'description' => 'Identification de points aberrants.']
            ],
            // Leçons pour "Réseaux de Neurones et Deep Learning"
            'reseaux-neurones-deep-learning' => [
                ['name' => 'Introduction aux réseaux de neurones', 'duration' => 3, 'description' => 'Perceptron, rétropropagation, fonctions d\'activation.'],
                ['name' => 'TensorFlow et Keras', 'duration' => 3, 'description' => 'Framework deep learning, construction de modèles.'],
                ['name' => 'Réseaux de neurones convolutifs (CNN)', 'duration' => 4, 'description' => 'Architecture pour l\'image, convolution, pooling.'],
                ['name' => 'Réseaux de neurones récurrents (RNN/LSTM)', 'duration' => 3, 'description' => 'Traitement de séquences, mémoire.'],
                ['name' => 'Techniques d\'optimisation', 'duration' => 2, 'description' => 'Regularisation, dropout, batch normalization.']
            ],
            // Leçons pour "Traitement du Langage Naturel (NLP)"
            'traitement-langage-naturel' => [
                ['name' => 'Prétraitement de texte', 'duration' => 2, 'description' => 'Tokenisation, lemmatisation, nettoyage.'],
                ['name' => 'Représentation vectorielle', 'duration' => 3, 'description' => 'Bag of words, TF-IDF, Word2Vec.'],
                ['name' => 'Classification de texte', 'duration' => 3, 'description' => 'Analyse de sentiment, catégorisation.'],
                ['name' => 'Modèles de langage', 'duration' => 3, 'description' => 'N-grammes, modèles neuronaux.'],
                ['name' => 'Transformers et BERT', 'duration' => 4, 'description' => 'Architecture attention, modèles pré-entraînés.']
            ],
            // Leçons pour "Vision par Ordinateur"
            'vision-ordinateur' => [
                ['name' => 'Introduction à OpenCV', 'duration' => 2, 'description' => 'Traitement d\'images de base, filtres.'],
                ['name' => 'Détection de contours et formes', 'duration' => 3, 'description' => 'Edge detection, détection de contours.'],
                ['name' => 'Détection d\'objets avec YOLO', 'duration' => 4, 'description' => 'Algorithmes de détection temps réel.'],
                ['name' => 'Reconnaissance faciale', 'duration' => 3, 'description' => 'Détection et reconnaissance de visages.'],
                ['name' => 'Segmentation d\'images', 'duration' => 3, 'description' => 'Sémantique et d\'instance, U-Net.']
            ],
            // Leçons pour "Déploiement de Modèles IA"
            'deploiement-modeles-ia' => [
                ['name' => 'MLOps et bonnes pratiques', 'duration' => 2, 'description' => 'Cycle de vie des modèles ML, versioning.'],
                ['name' => 'APIs avec Flask et FastAPI', 'duration' => 3, 'description' => 'Création d\'APIs pour servir des modèles.'],
                ['name' => 'Conteneurisation avec Docker', 'duration' => 2, 'description' => 'Packaging des modèles en conteneurs.'],
                ['name' => 'Déploiement cloud', 'duration' => 3, 'description' => 'AWS SageMaker, Azure ML, Google Cloud AI.'],
                ['name' => 'Monitoring et maintenance', 'duration' => 2, 'description' => 'Surveillance des performances, drift detection.']
            ]
        ];

        foreach ($lessonsData as $moduleSlug => $lessons) {
            $module = Module::where('slug', $moduleSlug)->first();
            if ($module) {
                foreach ($lessons as $index => $lessonData) {
                    Lesson::create([
                        'name' => $lessonData['name'],
                        'slug' => Str::slug($lessonData['name'] . '-' . $moduleSlug . '-' . ($index + 1)),
                        'description' => $lessonData['description'],
                        'duration' => $lessonData['duration'],
                        'module_id' => $module->id,
                    ]);
                }
            }
        }
    }
}
