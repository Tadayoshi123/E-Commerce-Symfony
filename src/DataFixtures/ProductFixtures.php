<?php

namespace App\DataFixtures;

use App\Entity\Categorie;
use App\Entity\Produit;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class ProductFixtures extends Fixture
{
    public function load(ObjectManager $manager): void
    {
        $faker = \Faker\Factory::create('fr_FR');
            for ($i= 1; $i <= 4; $i++) { 
                $categorie = new Categorie;
                $categorie->setTitre($faker->sentence());

                $manager->persist($categorie);
            }
            for ($j=1; $j <= mt_rand(8, 10); $j++) 
            {
                $produit = new Produit;
                $produit->setNom($faker->sentence(3))
                        ->setDescription()
            }
    }
}
