<?php

namespace App\Notification;
use Twig\Environment;
use App\Entity\Contact;

class ContactNotification
{
    /**
     * @var \Swift_Mailer
     */
    private $mailer;

    /**
     * @var Environment
     */
    private $renderer;

    public function __construct(\Swift_Mailer $mailer, Environment $renderer)
    {
        // Hors d'un controller, on ne peut faire d'injections de dépendances seulement dans un constructeur
        $this->mailer = $mailer;
        $this->renderer = $renderer;
    }

    public function notify(Contact $contact)
    {
        $message = (new \Swift_Message("Nouveau message de contact"))
                ->setFrom($contact->getEmail()) // expediteur
                ->setTo('YanisModo@contact.com') // destinataire
                ->setReplyTo($contact->getEmail()) // adresse de répoonse
                ->setBody($this->renderer->render('emails/contact.html.twig', [
                    'contact' => $contact 
                ]), 'text/html'); // on precise que le corps du mail est un fichier html pour interpreter les balises
        $this->mailer->send($message);
    }
}  