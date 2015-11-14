<?php 

require_once 'vendor/autoload.php';
//require_once 'db_cred.php';

//twig stuff

Twig_Autoloader::register();

$loader = new Twig_Loader_Filesystem('./templates/');

$twig = new Twig_Environment($loader, array(
		//'cache' => 'template_cache/'
));


function home(){

	global $twig;

	echo $twig->render('home.twig.html', array(
		'base' => getenv('BASE_URL'),
		'active' => 'home'
	));

}

function intro(){

	global $twig;

	echo $twig->render('intro.twig.html', array(
		'base' => getenv('BASE_URL'),
		'active' => 'intro'
	));

}

function structures(){

	global $twig;

	echo $twig->render('structures.twig.html', array(
		'base' => getenv('BASE_URL'),
		'active' => 'structures'
	));

}

function about(){

	global $twig;

	echo $twig->render('about.twig.html', array(
		'base' => getenv('BASE_URL'),
		'active' => 'about'
	));

}

function map(){

	global $twig;

	echo $twig->render('sitemap.twig.html', array(
		'base' => getenv('BASE_URL'),
	));
	
}

function ForbiddenHandler(){

	global $twig;

	http_response_code(403);

	echo $twig->render('403.twig.html', array(
		'base' => getenv('BASE_URL')
	));

}

function NotFoundHandler(){

	global $twig;

	http_response_code(404);

	echo $twig->render('404.twig.html', array(
		'base' => getenv('BASE_URL')

	));

}

function NotAllowedHandler(){

	global $twig;

	http_response_code(405);

	echo $twig->render('405.twig.html', array(
		'base' => getenv('BASE_URL')
	));

}

?>