<?php

namespace App\Controller;

use App\Entity\Produit;
use App\Repository\ProduitRepository;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class CommerceController extends AbstractController
{
    // #[Route('/', name: 'app_home')]
    // public function index(): Response
    // {
    //     return $this->render('commerce/home.html.twig', [
    //         'controller_name' => 'CommerceController',
    //     ]);
    // }

    #[Route('/produit', name: 'app_produit')]
    public function products(ProduitRepository $repo): Response
    {
        $produits = $repo->findAll();
        return $this->render('commerce/index.html.twig', [
            'produits' => $produits,
        ]);
    }

    #[Route('/produit/show/{id}', name:'produit_show')]

    public function show(Produit $produit)
    {
        return $this->render('commerce/show.html.twig', [
            'produit' => $produit
        ]);
    }
}
