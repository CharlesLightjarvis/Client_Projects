<?php

namespace App\Services;

class WeatherService
{
    public function getCurrentWeather(string $location, string $unit): string
    {
        return "The current weather in {$location} is 30° {$unit} with clear skies.";
    }
    
}