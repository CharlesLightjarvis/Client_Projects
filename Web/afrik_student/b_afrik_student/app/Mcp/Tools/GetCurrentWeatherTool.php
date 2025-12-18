<?php

namespace App\Mcp\Tools;

use App\Services\WeatherService;
use Illuminate\JsonSchema\JsonSchema;
use Laravel\Mcp\Request;
use Laravel\Mcp\Response;
use Laravel\Mcp\Server\Tool;

class GetCurrentWeatherTool extends Tool
{

    public function __construct(protected WeatherService $weatherService) {
        
    }

   protected string $description = <<<'MARKDOWN'
    Provides accurate real-time weather updates and forecasts for any location worldwide.
MARKDOWN;

    /**
     * Handle the tool request.
     */
    public function handle(Request $request): Response
    {
       $response = $this->weatherService->getCurrentWeather($request->get('location'), $request->get('unit'));

        return Response::text($response);
    }

    /**
     * Get the tool's input schema.
     *
     * @return array<string, \Illuminate\JsonSchema\JsonSchema>
     */
    public function schema(JsonSchema $schema): array
    {
        return [
            'location' => $schema->string()
                ->description('The location to get the weather for.')
                ->required(),
            'unit' => $schema->string()
                ->description('The unit for temperature (C for Celsius, F for Fahrenheit).')
                ->required()
                ->enum(['Celsius', 'Fahrenheit']),
        ];
    }
}
