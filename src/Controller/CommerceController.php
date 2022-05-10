<?php

namespace App\Controller;

use App\Entity\Contact;
use App\Entity\Produit;
use App\Form\ContactType;
use App\Repository\ProduitRepository;
use Doctrine\ORM\EntityManagerInterface;
use App\Notification\ContactNotification;
use Symfony\Component\HttpFoundation\Request;
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


    #[Route('/contact', name: 'blog_contact')]

public function contact(Request $request, EntityManagerInterface $manager, ContactNotification $notification)

{
 $contact = new Contact();
 $form = $this->createForm(ContactType::class, $contact);
 $form->handleRequest($request);


 if ($form->isSubmitted() && $form->isValid()) {
    $notification->notify($contact);
    $this->addFlash('success', 'Votre Email a bien été envoyé');
    $manager->persist($contact); // on prépare l'insertion
    $manager->flush(); // on execute l'insertion
 }
 return $this->render("mail/contact.html.twig", [
    'contact' => $contact
 ]);
}
}


