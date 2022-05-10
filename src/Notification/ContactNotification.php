<?php

namespace App\Notification;

use App\Entity\Contact;
use Twig\Environment;

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
        // hors d'un controller, on ne peut faire d'injections de dépendances seulement dans un constructeur
        $this->mailer = $mailer;
        $this->renderer = $renderer;
    }

    public function notify(Contact $contact)
    {
       {
        $message = (new \Swift_Message('Message:'. $contact->getContenu()))
        ->setFrom($contact->getEmail())
        ->setTo('gregorylacroix78@gmail.com')
        ->setReplyTo($contact->getEmail())
        ->setBody($this->renderer->render('mail/contact.html.twig', [
        'contact' => $contact
                ]), 'text/html');   // il faut préciser que le corps du mail est un fichier html pour interpréter les balises
        $this->mailer->send($message);
    }
}
}

