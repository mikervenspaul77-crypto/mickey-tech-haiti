# MICKEY TECH Haiti

Site vitrine en cours de construction pour présenter les téléphones, écrans, flex de charge et tablettes disponibles auprès de MICKEY TECH.

## Aperçu

Le catalogue se filtre par type de produit et par marque. Les prix sont laissés à compléter par la boutique. Les photos trouvées via Wikimedia Commons affichent leur source et leur licence; elles illustrent le modèle et ne confirment pas le stock réel.

## Modifier le catalogue

- `catalogue.js` contient les marques, types et références.
- `app.js` gère les filtres, recherches, panier, favoris et fiches.
- `styles.css` contient la présentation.
- `index.html` contient la structure du site.
- `images/` accueille les photos locales de la boutique.

Pour ajouter un prix, ajouter une propriété `price` numérique à la fiche générée par le catalogue. Le site affiche actuellement les prix en HTG; vérifier la devise avant toute publication.

## Déploiement

GitHub Pages déploie automatiquement la branche `main` depuis GitHub Actions. Les changements poussés sur `main` mettent à jour le site.

## Contact

Les prix, stocks, variantes et conditions de vente doivent être confirmés directement auprès de la boutique avant achat.