<?php

namespace App\Menu\DTO;

readonly class MenuSectionDTO
{
    /**
     * @param MenuItemDTO[] $items
     */
    public function __construct(
        public string $id,
        public string $title,
        public string $subtitle,
        public string $color,
        public array $items,
    ) {}

    public static function fromArray(string $key, array $data): self
    {
        $items = array_map(
            fn(array $item) => MenuItemDTO::fromArray($item),
            $data['items']
        );

        return new self(
            id: $data['id'],
            title: $data['title'],
            subtitle: $data['subtitle'],
            color: $data['color'],
            items: $items
        );
    }
}
