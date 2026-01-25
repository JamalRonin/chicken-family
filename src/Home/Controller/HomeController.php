<?php

namespace App\Home\Controller;

use App\Menu\Service\MenuProvider;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class HomeController extends AbstractController
{
    public function __construct(
        private MenuProvider $menuProvider
    ) {}

    #[Route('/', name: 'app_home')]
    public function index(): Response
    {
        return $this->render('home/index.html.twig', [
            'menu_sections' => $this->menuProvider->getAllSections(),
        ]);
    }
}
