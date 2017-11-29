# Visualisation de donnée - Carnet de Bord

Projet de DataViz mené à l'Université de Lyon en 2017, par :

- Charles Gaydon ;
- Paul Peseux ;
- Loic Robergeon.

Les spécifications du projets sont indiquée sur cette [page](https://lyondataviz.github.io/teaching/lyon1-m2/2017/projets.html). L'objectif est de réaliser une visualisation de données, ayant pour thématique les transport, la mobilité, les déplacements, etc. 
Le choix du sujet, du type de visualisation, est libre.  
Ce carnet de bord est destiné à tenir l'historique des choix de sujet, de type de design, de conception et d'implémentation qui auront été fait. 

Riches de recherches préalables sur la thématique des transports, nous abordons ce problème avec la méthode **[FDS](http://fds.design/)**. C'est une méthode itérative qui part d'un brainstorming pour ensuite filtrer les idées et préciser ses choix de design de plus en plus finement.


### 1. Séance du 16/11/2017

Voir le Draft N°1. 

**TL;TR** : Le projet s'axera donc autour de la temporalité des trajets ferroviaire, à deux échelles : nationale (en France) et continentale (en Europe). Nous partons sur une carte tempographique : distortion de distances géographiques prises comme ditance temporelle. Deux échelle : France et Europe, avec alors deux modalités de représentations, impliquant ou non une distortion de la frontière extérieur.

### 2. Séance du 24/11/2017

Voir le Draft N°2 et son Layout en fichier séparé.

**TL;TR** : Nous avons posé les bases de la carte des temps européens. Ainsi que le grand principe en terme de contenu et de desing du panneau latéral d'information qui devrait rendre compte des choix de sélection de l'utilisateur.

De plus, l'API Distances Matrix de google nous permet facilement d'obtenir des distances en train. Nous implémenterons un Dijsktra pour combler les données manquantes si il y en a trop. 

### 3. Troisième semaine : réflexion sourcée

Nous avons itéré une nouvelle fois sur le design européen (voir *ANNEXE - Europe layout #2*), et mis en image les spécifications du panneau latéral. 
Enfin, une recherche bibliographique nous permet de valider que notre application est une innovation vis-à-vis des récédentes tentatives de représenter les temps de trajet sur une carte.

[0 Travel Maps and their use](https://www.mysociety.org/2006/03/04/travel-time-maps-and-their-uses/) Les auteurs posent le même problème que nous, mais y répondent differemment. Ils surchargent la carte de couleur et reconnaissent d'ailleurs que leur carte est trop compliquée et pas assez lisible. La distance modifiée est surement plus efficace, car immédiate. On pourrait cependant ajouter de la redondance en colorant les cercles positionnant les villes. Par exemple, du blanc vers le rouge. Etre cohérent avec la coloration des zones concentriques cependant.
[1 Problème classique de visualiser des évènement **au cours du** temps](https://www.gislounge.com/time-and-gis/) : Un peu hors de  mais mets en valeur l'absence de recherche sur le sujet.
[2 Un catalogue des noms de visualisation.](https://datavizcatalogue.com/methods/connection_map.html) ; pour référence.
[3 les trajets londoniens](https://www.google.fr/url?sa=i&rct=j&q=&esrc=s&source=imgres&cd=&cad=rja&uact=8&ved=0ahUKEwjzmbmPpdrXAhUH0RQKHZdmAN8QjBwIBA&url=https%3A%2F%2Fwww.mysociety.org%2Ffiles%2F2014%2F03%2FSW1P4DR_20km_contours_800.png&psig=AOvVaw0sq1Jx6TXKQnOJnabvql7D&ust=1511718614044226). Temps de transport autour de Londre par aires (pas forcément cylindriques, mais colorées, avec un bandeau inférieur horizontal de légende. Donne l'idée d'une deuxième manière de visualiser la distance qui pourrait se rajouter aux premières ? 
[4 Une de nos idées déjà mise en oeuvre](http://www.visualcomplexity.com/vc/images/204_big01.jpg) L'idée d'alterner les zones de couleurs grises a eu déjà des implémentations. 
[5 Une carte standard, un graphe de villes aux arrêtes légendées](https://i.pinimg.com/736x/4a/20/ba/4a20ba4e62b9c65c1c6b443f1ea96332--interrail-map-interrail-europe.jpg) Afficher des chiffres le long des chemins surcharge vite d'information...
[6 : les trajets en UK](http://www.citymetric.com/sites/default/files/styles/nodeimage/public/article_2015/10/tf_hull.png?itok=yXTpA_iS) Représenter la distance est plus commun. Ce design est simple et peut nous inspirer.
[7 Illustration d rétrécissement de l'Europe apporté par le TGV](https://www.google.fr/search?biw=1093&bih=510&tbm=isch&sa=1&ei=J60ZWu7TJ8SVkwXIrocw&q=mapping+time+travel&oq=mapping+time+travel&gs_l=psy-ab.3...30131.33256.0.33464.19.17.0.2.2.0.131.1575.11j6.17.0....0...1c.1.64.psy-ab..0.14.1128...0j0i67k1j0i30k1j0i19k1j0i8i30i19k1j0i5i30i19k1j0i30i19k1.0.k9iIbOyQr-0#imgrc=Ok8IRwoeklerQM:) et aussi [8](https://www.slideshare.net/jeroenvanschaick/schaickurbanbodymappingtimespace02) qui illustre la dépendance de la représentation au mode de transport et à l'échelle. Notion de carte tempographique ! Ce travail nous mène vers [9 : les tavaux de Spiekermann-Wegener sur les cartes temps-espace](http://www.spiekermann-wegener.com/mod/time/time_e.htm), dont un rapport méthodologique est proposé [ici](http://www.spiekermann-wegener.com/pub/pdf/IRPUD_AP132.pdf). Les auteurs déforment la carte d'Europe en la grillant, et en déterminant la distance temporelle de chaque noeud de leur grille par une interpolation triangulaire. A creuser, car pourrait permettre de modifier la carte arrière de l'Europe, et aussi de la France, d'une manière plus précise.
[9 La France en temps, et de la biblio sur le concept](http://philippe.gambette.free.fr/Train/)  