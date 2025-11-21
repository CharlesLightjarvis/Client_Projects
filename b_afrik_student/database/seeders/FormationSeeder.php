<?php

namespace Database\Seeders;

use App\Enums\UserRoleEnum;
use App\Models\Formation;
use App\Models\Lesson;
use App\Models\Module;
use App\Models\User;
use Illuminate\Database\Seeder;

class FormationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Récupérer les instructeurs existants
        $instructors = User::whereHas('roles', function ($query) {
            $query->where('name', UserRoleEnum::INSTRUCTOR->value);
        })->get();

        if ($instructors->isEmpty()) {
            $this->command->warn('Aucun instructeur trouvé! Veuillez d\'abord créer des instructeurs.');
            return;
        }
        // Formation AutoCAD
        $autocad = Formation::create([
            'title' => 'AutoCAD Complet',
            'description' => 'Formation complète sur AutoCAD pour le dessin technique et la conception assistée par ordinateur.',
            'learning_objectives' => 'Maîtriser les outils de dessin 2D et 3D, créer des plans techniques professionnels, gérer les calques et les blocs.',
            'target_skills' => ['Dessin technique', 'Modélisation 3D', 'Gestion de projets CAO'],
            'level' => 'medium',
            'duration' => 40, // 40 heures
            'image_url' => 'https://images.unsplash.com/photo-1503387762-592deb58ef4e',
            'price' => 499.99,
        ]);

        // Modules AutoCAD
        $autocadBasics = Module::create([
            'formation_id' => $autocad->id,
            'title' => 'Les Bases d\'AutoCAD',
            'description' => 'Introduction aux concepts de base et à l\'interface d\'AutoCAD',
            'order' => 1,
        ]);

        Lesson::create([
            'module_id' => $autocadBasics->id,
            'title' => 'Introduction à AutoCAD',
            'content' => 'Découverte de l\'interface et des outils de base',
            'order' => 1,
        ]);

        Lesson::create([
            'module_id' => $autocadBasics->id,
            'title' => 'Les outils de dessin',
            'content' => 'Maîtrise des outils de dessin: lignes, cercles, arcs',
            'order' => 2,
        ]);

        Lesson::create([
            'module_id' => $autocadBasics->id,
            'title' => 'Les calques',
            'content' => 'Gestion et organisation des calques',
            'order' => 3,
        ]);

        $autocadAdvanced = Module::create([
            'formation_id' => $autocad->id,
            'title' => 'AutoCAD Avancé',
            'description' => 'Techniques avancées de modélisation 2D et 3D',
            'order' => 2,
        ]);

        Lesson::create([
            'module_id' => $autocadAdvanced->id,
            'title' => 'Modélisation 3D',
            'content' => 'Introduction à la modélisation en 3 dimensions',
            'order' => 1,
        ]);

        Lesson::create([
            'module_id' => $autocadAdvanced->id,
            'title' => 'Rendu et présentation',
            'content' => 'Création de rendus photoréalistes',
            'order' => 2,
        ]);

        // Formation Revit
        $revit = Formation::create([
            'title' => 'Revit Architecture',
            'description' => 'Formation complète sur Revit pour la modélisation architecturale BIM.',
            'learning_objectives' => 'Comprendre les concepts BIM, modéliser des bâtiments complets, créer des familles paramétriques.',
            'target_skills' => ['BIM', 'Modélisation architecturale', 'Familles Revit', 'Documentation'],
            'level' => 'hard',
            'duration' => 50, // 50 heures
            'image_url' => 'https://images.unsplash.com/photo-1503387762-592deb58ef4e',
            'price' => 599.99,
        ]);

        $revitBasics = Module::create([
            'formation_id' => $revit->id,
            'title' => 'Introduction à Revit',
            'description' => 'Concepts BIM et interface Revit',
            'order' => 1,
        ]);

        Lesson::create([
            'module_id' => $revitBasics->id,
            'title' => 'Le BIM et Revit',
            'content' => 'Comprendre le Building Information Modeling',
            'order' => 1,
        ]);

        Lesson::create([
            'module_id' => $revitBasics->id,
            'title' => 'Modélisation de base',
            'content' => 'Créer des murs, portes et fenêtres',
            'order' => 2,
        ]);

        $revitAdvanced = Module::create([
            'formation_id' => $revit->id,
            'title' => 'Revit Avancé',
            'description' => 'Familles paramétriques et documentation',
            'order' => 2,
        ]);

        Lesson::create([
            'module_id' => $revitAdvanced->id,
            'title' => 'Création de familles',
            'content' => 'Développer des familles paramétriques personnalisées',
            'order' => 1,
        ]);

        // Formation SketchUp
        $sketchup = Formation::create([
            'title' => 'SketchUp Pro',
            'description' => 'Maîtrise de SketchUp pour la modélisation 3D architecturale.',
            'learning_objectives' => 'Créer des modèles 3D rapidement, utiliser les plugins essentiels, exporter vers différents formats.',
            'target_skills' => ['Modélisation 3D rapide', 'Rendu SketchUp', 'Plugins'],
            'level' => 'easy',
            'duration' => 30, // 30 heures
            'image_url' => 'https://images.unsplash.com/photo-1503387762-592deb58ef4e',
            'price' => 399.99,
        ]);

        $sketchupBasics = Module::create([
            'formation_id' => $sketchup->id,
            'title' => 'SketchUp Débutant',
            'description' => 'Premiers pas avec SketchUp',
            'order' => 1,
        ]);

        Lesson::create([
            'module_id' => $sketchupBasics->id,
            'title' => 'Interface SketchUp',
            'content' => 'Navigation et outils de base',
            'order' => 1,
        ]);

        Lesson::create([
            'module_id' => $sketchupBasics->id,
            'title' => 'Modélisation simple',
            'content' => 'Créer des formes et volumes simples',
            'order' => 2,
        ]);

        $this->command->info('Formations, modules et leçons créés avec succès!');
    }
}
