<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        $categories = [
            ['name' => 'Développement web', 'description' => 'Catégorie de formations liées au développement web'],
            ['name' => 'Devops', 'description' => 'Catégorie de formations liées au devops'],
            ['name' => 'Testing', 'description' => 'Catégorie de formations liées au testing'],
            ['name' => 'Sécurité informatique', 'description' => 'Catégorie de formations liées à la sécurité des systèmes informatiques'],
            ['name' => 'Cloud Computing', 'description' => 'Catégorie de formations liées aux technologies cloud (AWS, Azure, GCP)'],
            ['name' => 'Intelligence Artificielle', 'description' => 'Catégorie de formations liées à l\'IA et au machine learning'],
            ['name' => 'Big Data', 'description' => 'Catégorie de formations liées à la gestion et l\'analyse des données massives'],
            ['name' => 'Réseaux et infrastructure', 'description' => 'Catégorie de formations liées à la gestion des réseaux et des infrastructures IT'],
            ['name' => 'Gestion de projet IT', 'description' => 'Catégorie de formations liées à la gestion de projets informatiques'],
            ['name' => 'Développement mobile', 'description' => 'Catégorie de formations liées au développement d\'applications mobiles'],
            ['name' => 'Blockchain', 'description' => 'Catégorie de formations liées à la technologie blockchain'],
            ['name' => 'UI/UX Design', 'description' => 'Catégorie de formations liées au design d\'interface utilisateur'],
            ['name' => 'Data Science', 'description' => 'Catégorie de formations liées à la science des données'],
            ['name' => 'Cybersécurité', 'description' => 'Catégorie de formations liées à la protection des systèmes informatiques'],
            ['name' => 'Automatisation', 'description' => 'Catégorie de formations liées à l\'automatisation des processus'],
            ['name' => 'Développement de jeux vidéo', 'description' => 'Catégorie de formations liées au développement de jeux vidéo'],
            ['name' => 'Gestion de bases de données', 'description' => 'Catégorie de formations liées à la gestion de bases de données'],
            ['name' => 'Programmation orientée objet', 'description' => 'Catégorie de formations liées à la POO'],
            ['name' => 'Développement full-stack', 'description' => 'Catégorie de formations liées au développement full-stack'],
            ['name' => 'Administration système', 'description' => 'Catégorie de formations liées à l\'administration système'],
        ];

        foreach ($categories as $category) {
            Category::create([
                'name' => $category['name'],
                'slug' => Str::slug($category['name']),
                'description' => $category['description'],
            ]);
        }
    }
}
