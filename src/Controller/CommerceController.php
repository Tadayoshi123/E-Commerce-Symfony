<?php

namespace App\Controller;

use App\Entity\Commentaire;
use App\Entity\Contact;
use App\Entity\Produit;
use App\Entity\User;
use App\Form\CommentaireType;
use App\Form\ContactType;
use App\Form\ProduitType;
use App\Form\RechercheType;
use App\Repository\ProduitRepository;
use Doctrine\ORM\EntityManagerInterface;
use App\Notification\ContactNotification;
use Doctrine\ORM\EntityManager;
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
    public function products(ProduitRepository $repo, Request $request): Response
    {
        $form = $this->createForm(RechercheType::class);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) // si l'utilisateur fait une recherche
        {
            $data = $form->get('recherche')->getData(); //je recupère la saisie de l'utilisateur
            $produits = $repo->getProduitsByName($data);
        } else //sinon, pas de recherche = récupération de tous les articles
        {
            $produits = $repo->findAll();
            // je recupère les articles que je stocke dans un tableau $articles
        }
        return $this->render('commerce/index.html.twig', [
            'produits' => $produits,
            'formRecherche' => $form->createView()
        ]);
    }

    #[Route('/produit/show/{id}', name: 'produit_show')]

    public function show(Produit $produit, Request $request, EntityManagerInterface $manager, Commentaire $commentaire = null)
    {
        $user = $this->getUser();
        $commentaire = new Commentaire;
        $commentaire->setUserId($user);
        $commentaire->setProduitId($produit);
        $commentaire->setCreatedAt(new \DateTime());

        $form = $this->createForm(CommentaireType::class, $commentaire);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $manager->persist($commentaire);
            $manager->flush();
            return $this->render('commerce/show.html.twig', [
                'id' => $produit->getId()
            ]);
        }
        if (null === $produit) {
            $this->addFlash("error", "Produit Introuvable !");
            return $this->redirectToRoute('app_produit');
        } else {
            return $this->render('commerce/show.html.twig', [
                'produit' => $produit,
                'formCommentaire' => $form->createView()
            ]);
        }
    }

    #[Route('/create', name: 'app_create')]
    #[Route('/edit/{id}', name: 'app_edit')]

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
