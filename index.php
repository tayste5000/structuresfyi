<?php 

require_once 'vendor/autoload.php';

//loading environment variables
$dotenv = new Dotenv\Dotenv(__DIR__);
$dotenv->load();

require_once 'handlers.php';

$dispatcher = FastRoute\simpleDispatcher(function(FastRoute\RouteCollector $r) {
    $r->addRoute('GET', '/', 'home');
    $r->addRoute('GET', '/intro/', 'intro');
    $r->addRoute('GET', '/intro/protein/', 'proteins');
    $r->addRoute('GET', '/resources/', 'resources');
    $r->addRoute('GET', '/about/', 'about');
    $r->addRoute('GET', '/structures/', 'structures');
    $r->addRoute('GET', '/structures/car/', 'car');
    $r->addRoute('GET', '/structures/pc/', 'pc');
    $r->addRoute('GET', '/site-map/', 'map');
    $r->addRoute('GET', '/403/', 'ForbiddenHandler');
});

// Fetch method and URI from somewhere
$httpMethod = $_SERVER['REQUEST_METHOD'];
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

$routeInfo = $dispatcher->dispatch($httpMethod, $uri);
switch ($routeInfo[0]) {
    case FastRoute\Dispatcher::NOT_FOUND:

    		echo call_user_func('NotFoundHandler');

        break;
    case FastRoute\Dispatcher::METHOD_NOT_ALLOWED:
        $allowedMethods = $routeInfo[1];
        // ... 405 Method Not Allowed

        http_response_code(405);

        echo call_user_func('NotAllowedHandler');

        break;
    case FastRoute\Dispatcher::FOUND:
        $handler = $routeInfo[1];
        $vars = $routeInfo[2];
        // ... call $handler with $vars

        echo call_user_func($handler, $vars);

        break;
}



?>