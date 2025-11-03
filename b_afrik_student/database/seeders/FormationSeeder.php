<?php

namespace Database\Seeders;

use App\Models\Formation;
use App\Models\Lesson;
use App\Models\Module;
use Illuminate\Database\Seeder;

class FormationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Formation AutoCAD
        $autocad = Formation::create([
            'title' => 'AutoCAD Complet',
            'description' => 'Formation complète sur AutoCAD pour le dessin technique et la conception assistée par ordinateur.',
        ]);

        // Modules AutoCAD
        $autocadBasics = Module::create([
            'formation_id' => $autocad->id,
            'title' => 'Les Bases d\'AutoCAD',
            'description' => 'Introduction aux concepts de base et à l\'interface d\'AutoCAD',
        ]);

        Lesson::create([
            'module_id' => $autocadBasics->id,
            'title' => 'Introduction à AutoCAD',
            'content' => 'Découverte de l\'interface et des outils de base',
        ]);

        Lesson::create([
            'module_id' => $autocadBasics->id,
            'title' => 'Les outils de dessin',
            'content' => 'Maîtrise des outils de dessin: lignes, cercles, arcs',
        ]);

        Lesson::create([
            'module_id' => $autocadBasics->id,
            'title' => 'Les calques',
            'content' => 'Gestion et organisation des calques',
        ]);

        $autocadAdvanced = Module::create([
            'formation_id' => $autocad->id,
            'title' => 'AutoCAD Avancé',
            'description' => 'Techniques avancées de modélisation 2D et 3D',
        ]);

        Lesson::create([
            'module_id' => $autocadAdvanced->id,
            'title' => 'Modélisation 3D',
            'content' => 'Introduction à la modélisation en 3 dimensions',
        ]);

        Lesson::create([
            'module_id' => $autocadAdvanced->id,
            'title' => 'Rendu et présentation',
            'content' => 'Création de rendus photoréalistes',
        ]);

        // Formation Revit
        $revit = Formation::create([
            'title' => 'Revit Architecture',
            'description' => 'Formation complète sur Revit pour la modélisation architecturale BIM.',
        ]);

        $revitBasics = Module::create([
            'formation_id' => $revit->id,
            'title' => 'Introduction à Revit',
            'description' => 'Concepts BIM et interface Revit',
        ]);

        Lesson::create([
            'module_id' => $revitBasics->id,
            'title' => 'Le BIM et Revit',
            'content' => 'Comprendre le Building Information Modeling',
        ]);

        Lesson::create([
            'module_id' => $revitBasics->id,
            'title' => 'Modélisation de base',
            'content' => 'Créer des murs, portes et fenêtres',
        ]);

        $revitAdvanced = Module::create([
            'formation_id' => $revit->id,
            'title' => 'Revit Avancé',
            'description' => 'Familles paramétriques et documentation',
        ]);

        Lesson::create([
            'module_id' => $revitAdvanced->id,
            'title' => 'Création de familles',
            'content' => 'Développer des familles paramétriques personnalisées',
        ]);

        // Formation SketchUp
        $sketchup = Formation::create([
            'title' => 'SketchUp Pro',
            'description' => 'Maîtrise de SketchUp pour la modélisation 3D architecturale.',
        ]);

        $sketchupBasics = Module::create([
            'formation_id' => $sketchup->id,
            'title' => 'SketchUp Débutant',
            'description' => 'Premiers pas avec SketchUp',
        ]);

        Lesson::create([
            'module_id' => $sketchupBasics->id,
            'title' => 'Interface SketchUp',
            'content' => 'Navigation et outils de base',
        ]);

        Lesson::create([
            'module_id' => $sketchupBasics->id,
            'title' => 'Modélisation simple',
            'content' => 'Créer des formes et volumes simples',
        ]);

        $this->command->info('Formations, modules et leçons créés avec succès!');
    }
}
