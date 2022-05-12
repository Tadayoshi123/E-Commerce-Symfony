<?php

namespace App\Controller;

use App\Form\ContactType;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class ContactController extends AbstractController
{
    #[Route('/contact', name: 'app_contact')]
    public function index(Request $request, \Swift_Mailer $mailer): Response
    {
        $form = $this->createForm(ContactType::class);
        $form->handleRequest($request);
        
        if($form->isSubmitted()&& $form->isValid()){
            $contact = $form->getData();
            $message = (new \Swift_Message('nouveau contact'))
                ->setFrom($contact->getEmail()) // expediteur
                ->setTo('YanisModo@contact.com') // destinataire
                ->setReplyTo($contact->getEmail()) // adresse de répoonse
                ->setBody(
                    $this->renderView(
                        'emails/contact.html.twig', compact('contact')
                    ),
                     'text/html'
                )
            ; // on precise que le corps du mail est un fichier html pour interpreter les balises
        $mailer->send($message);
        $this->addFlash('message', 'message envoyée');
        return $this->redirectToRoute('app_produit');
        }


        return $this->render('contact/index.html.twig', [
            'contactForm' => $form->createView() 
        ]);
    }
}
