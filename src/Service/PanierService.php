<?php

namespace App\Service;

use App\Repository\ProduitRepository;
use Symfony\Component\HttpFoundation\RequestStack;

class PanierService
{
    private $repo;
    private $rs;

    public function __construct(ProduitRepository $repo, RequestStack $rs)
    {
        $this->repo= $repo;
        $this->rs = $rs;
    }

    public function add($id)
    {
        $session = $this->rs->getSession();

        $panier = $session->get('panier', []);

        if (!empty($panier[$id]))
            $panier[$id]++;
        else
            $panier[$id] = 1;

        $session->set('panier', $panier);
    }

    public function remove($id)
    {
        $session = $this->rs->getSession();
        $panier = $session->get('panier', []);

        if (!empty($panier[$id]))
            unset($panier[$id]);

        $session->set('panier', $panier);
    }

    public function getPanierWithData()
    {
        $session = $this->rs->getSession();
        $panier = $session->get('panier', []);
        $qt = 0;

        $panierWithData = [];

        foreach ($panier as $id => $quantity) {
            $panierWithData[] = [
                'produit' => $this->repo->find($id),
                'quantity' => $quantity
            ];
            $qt += $quantity;
        }
        $session->get('qt', $qt);

        return $panierWithData;
    }

    public function getTotal()
    {
        $total = 0;

        foreach ($this->getPanierWithData() as $item) {
            $totalItem = $item['produit']->getPrix() * $item['quantity'];
            $total += $totalItem;
        }
        return $total;
    }
}