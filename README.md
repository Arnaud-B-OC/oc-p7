# Mon vieux Grimoire

Code du projet 7 développeur web : Développez le back-end d'un site de notation de livres.

https://p7.radiant-horizon.net/

## Information pour le lancer le projet

Le projet nécessite node 20 et typescript.

Il faut également configurer les variables d'environnement suivante dans un fichier .env

```.env
MONGODB_URL=mongodb+srv://...
JWT_SECRET_TOKEN=RANDOM_TOKEN_SECRET
```

Et ensuite lancer le projet avec :

```
# Construire le projet
npm run build

# Lancer le projet
npm start
```