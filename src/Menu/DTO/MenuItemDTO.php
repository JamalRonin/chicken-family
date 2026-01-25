<?php

namespace App\Menu\DTO;

readonly class MenuItemDTO
{
    public function __construct(
        public string $name,
        public string $description,
        public string $emoji,
        public ?string $priceSolo = null,
        public ?string $priceMenu = null,
        public ?string $priceDouble = null,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            name: $data['name'],
            description: $data['desc'],
            emoji: $data['emoji'],
            priceSolo: $data['priceSolo'] ?? null,
            priceMenu: $data['priceMenu'] ?? null,
            priceDouble: $data['priceDouble'] ?? null,
        );
    }
}
