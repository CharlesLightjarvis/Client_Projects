<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class CertificationExamSeeder extends Seeder
{
    /**
     * Run the database seeds.
     * 
     * This seeder combines chapter creation and exam configuration
     * to provide a complete certification exam setup.
     */
    public function run(): void
    {
        $this->command->info('Starting certification exam setup...');

        // Step 1: Create chapters and questions
        $this->command->info('Creating chapters and questions...');
        $this->call(ChapterSeeder::class);

        // Step 2: Create exam configurations
        $this->command->info('Creating exam configurations...');
        $this->call(ExamConfigurationSeeder::class);

        $this->command->info('Certification exam setup completed successfully!');
    }
}