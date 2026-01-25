<?php

namespace App\Chat\Controller;

use App\Chat\Service\GeminiService;
use App\Menu\Service\MenuProvider;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/chat', name: 'api_chat_')]
class ChatController extends AbstractController
{
    public function __construct(
        private GeminiService $geminiService,
        private MenuProvider $menuProvider
    ) {}

    #[Route('', name: 'message', methods: ['POST'])]
    public function chat(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $message = $data['message'] ?? null;

        if (empty($message)) {
            return $this->json(['error' => 'Message is required'], Response::HTTP_BAD_REQUEST);
        }

        // Get Menu Data for Context
        // We pass the DTOs directly, json_encode in GeminiService will handle serialization of public properties
        $menuSections = $this->menuProvider->getAllSections();

        $response = $this->geminiService->chat($message, $menuSections);

        return $this->json(['response' => $response]);
    }
}
