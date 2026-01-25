<?php

namespace App\Menu\Service;

use App\Menu\DTO\MenuSectionDTO;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;

class MenuProvider
{
    public function __construct(
        private ParameterBagInterface $params
    ) {}

    /**
     * @return MenuSectionDTO[]
     */
    public function getAllSections(): array
    {
        $menuData = $this->params->get('menu_items');

        return array_map(
            fn(string $key, array $section) => MenuSectionDTO::fromArray($key, $section),
            array_keys($menuData),
            $menuData
        );
    }
}
