<?php

namespace App\Chat\Service;

use Symfony\Contracts\HttpClient\HttpClientInterface;

class GeminiService
{
    public function __construct(
        private HttpClientInterface $httpClient,
        private string $geminiApiKey
    ) {}

    public function chat(string $userMessage, array $menuData): string
    {
        $systemPrompt = sprintf(
            "Tu es l'expert menu de Chicken Family. SAVOIR : %s. " .
                "RÉPONDS: Plats du JSON uniquement. Gras (**). Concis. " .
                "Halal. 100%% Filet. Mar-Dim 18h30-23h. " .
                "IMPORTANT: Pour toute allergie sévère, merci de consulter notre équipe en restaurant avant de commander.",
            json_encode($menuData, JSON_UNESCAPED_UNICODE)
        );

        try {
            $response = $this->httpClient->request(
                'POST',
                'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent',
                [
                    'headers' => ['Content-Type' => 'application/json'],
                    'query' => ['key' => $this->geminiApiKey],
                    'json' => [
                        'contents' => [['parts' => [['text' => $userMessage]]]],
                        'systemInstruction' => ['parts' => [['text' => $systemPrompt]]]
                    ]
                ]
            );

            $data = $response->toArray();
            return $data['candidates'][0]['content']['parts'][0]['text'] ?? 'Désolé, je ne peux pas répondre pour le moment.';
        } catch (\Throwable $e) {
            // Log error here in a real app
            return 'Une erreur est survenue. Veuillez réessayer.';
        }
    }
}
