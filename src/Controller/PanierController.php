<?php

namespace App\Controller;

use App\Service\PanierService;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class PanierController extends AbstractController
{
    #[Route('/panier', name: 'app_panier')]
    public function index(PanierService $cs): Response
    {
        return $this->render('panier/index.html.twig', [
            'items' => $cs->getPanierWithData(),
            'total' => $cs->getTotal()
        ]);
    }

    #[Route('/panier/add/{id}', name: 'panier_add')]
    public function add($id, PanierService $cs)
    {
        $cs->add($id);
        return $this->redirectToRoute('app_panier');
    }

    #[Route('/panier/remove/{id}', name: 'panier_remove')]

    public function remove($id, PanierService $cs)
    {
        $cs->remove($id);
        return $this->redirectToRoute('app_panier');
    }
}
