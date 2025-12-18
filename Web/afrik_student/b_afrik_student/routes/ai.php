<?php

use App\Mcp\Servers\WeatherServer;
use Laravel\Mcp\Facades\Mcp;

// Mcp::web('/mcp/demo', \App\Mcp\Servers\PublicServer::class);
Mcp::web('/mcp/weather', WeatherServer::class);

