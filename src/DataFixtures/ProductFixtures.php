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
        for ($i = 1; $i <= 4; $i++) {
            $categorie = new Categorie;
            $categorie->setTitre($faker->sentence());

            $manager->persist($categorie);
        }
        for ($j = 1; $j <= mt_rand(8, 10); $j++) {
            $produit = new Produit;

            $description = '<p>' . join('</p><p>', $faker->paragraphs(5)) . '</p>';

            $produit->setNom($faker->sentence(3))
                ->setDescription($description)
                ->setImage("http://picsum.photos/250/150")
                ->setPrix($faker->randomFloat(2, 10, 100))
                ->setCategorieId($categorie);
            $manager->persist($produit);
        }
        $manager->flush();
    }
}
