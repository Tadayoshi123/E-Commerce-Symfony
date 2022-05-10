<?php

namespace App\Controller;

use App\Entity\Produit;
use App\Form\ProduitType;
use App\Repository\ProduitRepository;
use Doctrine\ORM\EntityManagerInterface;
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

    #[Route('/produit/show/{id}', name: 'produit_show')]

    public function show(Produit $produit)
    {
        return $this->render('commerce/show.html.twig', [
            'produit' => $produit
        ]);
    }

    #[Route('/create', name: 'app_create')]

    public function create(Request $request, EntityManagerInterface $manager, Produit $produit = null)
    {
        // article = null signifie que si l'on va sur la route ne alors $article = null
        // et si on est sur edit, alors l'article correspondra à l'id dans la route

        // la classe Request contient toutes les données des superglobales
        if (!$produit) {
            $produit = new Produit;
        }
        // je créer un objet Article vide prêt à être rempli
        dump($request);
        // dans la classe Request, l'objet request contient les données de $_POST
        //l'objet query contient les données de $_GET


        $form = $this->createForm(ProduitType::class, $produit);
        $form->handleRequest($request);
        // handleRequest() permet de faire certaines vérifications (la méthode du formulaire ?)
        // permet aussi de vérifier si les champs sont remplis
        //dump($article);

        if ($form->isSubmitted() && $form->isValid()) {
            $manager->persist($produit);
            $manager->flush();
            return $this->redirectToRoute('produit_show', [
                'id' => $produit->getId()
            ]);
            // après insertion de l'article, je me redirige vers la route blog_show
            // cette route a besoin du paramètre "id" : l'id de l'article que je viens d'insérer
        }
        return $this->render('commerce/create.html.twig', [
            'formProduit' => $form->createView(),
            // createView() renvoie un objet permettant d'afficher le formulaire
            'editMode' => $produit->getId() !== null
            // editMode = 1 si on est en édition
            // editMode = 0 si on est en création
        ]);
    }
}
