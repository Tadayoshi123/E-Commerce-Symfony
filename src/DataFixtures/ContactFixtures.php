<?php

namespace App\DataFixtures;
use DateTime;
use Faker\Factory;
use App\Entity\Contact;
use Doctrine\Persistence\ObjectManager;
use Doctrine\Bundle\FixturesBundle\Fixture;

class ContactFixtures extends Fixture
{
    public function load(ObjectManager $manager): void
    {   
        $now = new DateTime();
        $faker = \Faker\Factory::create('fr_FR');

        for ($j = 1; $j <= mt_rand(8, 10); $j++) {
            $contact = new Contact;

        $days= (new \DateTime())->diff($contact->getCreatedAt())->days;
    
        
        $contact->setNom($faker->sentence(3))
        ->setPrenom($faker->sentence(1))
        ->setEmail($faker->email)
        ->setContenu($faker->paragraph(3))
        ->setCreatedAt($faker->dateTimeBetween('-' . $days . ' days'));
        $manager->persist($contact);

        $manager->flush();
    }
}
}