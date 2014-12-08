Présentation du projet
======================

L'ANR Modelespace est un projet interdisciplinaire né de la collaboration de deux laboratoires d'histoire et d'archéologie, FRAMESPA-Terrae (UMR 5608), et CITERES -Lat (UMR 6173), et d'un laboratoire de mathématique, l'IMT (UMR 5219). Le projet a re&ccedil;u le soutien de l'ANR pour la période 2010-2012. L'objectif est de développer une procédure d'étude permettant d'analyser les dynamiques spatiales des peuplements à partir de sources fiscales serielles de natures différentes. Il s'agit en particulier de pouvoir intégrer à ces processus d'analyses déjà bien maîtrisés à partir de représentations cartographiques de l'espace (plans cadastraux, photographies aériennes...) des documents dépourvus de plan tels que les terriers et les compoix méridionaux. Il sera alors possible de travailler sur ces dynamiques spatiales non seulement sur les 200 à 300 dernières années, mais de remonter aux derniers siècles du Moyen Age lorsque la documentation le permet.

Mode d'emploi du site WEB
=========================

Objectif
--------

Le site WEB du projet Modelespace a un double objectif. Il a pour but et d'être un outil de travail pour les membres du projet. Une partie du développement informatique de la plateforme technique se fera à partir de ce site. En outre il est destiné à partager l'ensemble des informations issues de ce programme. Il peut s'agir aussi bien des données brutes sur lesquelles nous travaillons (sources photographiées) que des données retravaillées (méta-sources), comme les bases de données, que des comptes rendus de réunions, ou différents outils de travail (textes, articles, BDD...). Par ailleurs, il nous a semblé important d'ouvrir ce site sur l'extérieur, de manière à en faire un noeud regroupant l'information sur le problème de la modélisation des sources fiscales pré-industrielles, et de manière plus large, sur les sources fiscales en question (compoix, terriers, plans cadastraux pré-révolutionnaires... L'essentiel des données se trouvant sur le site sont donc accessible soit directement, soit après un simple enregistrement. Seul l'accès aux documents de travail et aux structures des bases de données ne sont accessibles qu'aux membres du projet. Enfin, il convient de préciser que ce site, de même que le projet ANR est ouvert à toute collaboration et suggestion. Toute suggestion peut-être adressé à florent.hautefeuille@univ-tlse2.fr

Contenu
-------

### L'activité du projet
La construction de ce site s'est faite autour du projet ANR lui-même. Le site comprend un volet important de données brutes sous formes de photos, de bases de données, de fichiers textes et PDF. Une bibliographie thématique est également proposée. Le site est donc destiné à transcrire l'activité du projet.

### L'inventaire des sources utilisables
La seconde partie du site est la partie dynamique. Elle concerne la gestion des bases de données directement liés aux compoix et terriers. La première [Ressources] consiste en une liste des sources utilisables sur le projet. Elle est nourrie par un projet connexe sous la direction de JL Abbé destiné à mieux comprendre la répartition spatiale et temporelle, de même que la nature exacte de ces documents appelés de manière générique par le terme de "compoix". L'objectif est de proposer un inventaire le plus complet possible des compoix du sud de la France, département par département. La plupart des fiches de cette base n'ouvrent que sur des informations très limitées (côte du compoix, date, commune...) Certaines fiches devraient être complétées par une analyse plus fine du registre lorsque celle-ci aura été faite. Par ailleurs, un certain nombre de compoix ont été numérisés, au grès des différents études. Nous proposons un outil de visualisation de ces registres. Enfin, pour un nombre très limité de registres, un basculement vers la base de données du contenu du document est proposé.

### La base de données du contenu des registres
C'est cette seconde base de donnée qui constitue le c&oelig;ur du site. Il s'agit d'une BDD destinée à recevoir non pas une liste de sources, mais le contenu de ces sources. Il n'était pas envisageable de générer une BDD universelle des compoix et des terriers. L'absence de normalisation de ces sources et leurs très grandes variétés formelles dans l'espace et le temps interdit toute généralisation. Nous nous sommes donc contentés de tenter de mettre en avant une architecture générale essentiellement destinée à gérer les données directement utilisables pour la spatialisation de l'information. L'interface proposée en ligne n'est qu'une interface de requête et non de saisie. Plutôt que d'imposer un cadre trop rigide pour la saisie, nous avons opté pour un système permettant d'intégrer des données provenant de différents logiciels de BDD (4D, File maker...). Il suffit que la BDD reprenne a minima une structure en 6 tables principales. Seules les données issues de ces tables seront intégrables, mais il demeure possible de développer de manière indépendante des bases plus complexes et mieux adaptées à chaque cas. Nous mettons également à disposition, mais sous une forme téléchargeable une BDD développée sous File maker pro et qui répond précisément à la définition des 6 tables évoquées ci-dessus. La particularité de la BDD proposée est de pouvoir cumuler l'ensemble des données de plusieurs dizaines de registres et, de ce fait, de pouvoir faire des requêtes très variées, sur un document unique, sur tous les documents d'une commune, ou sur un groupe plus important de registres. L'ensemble de ces données est récupérable soit sous la forme de fichiers CSV, soit sous la forme de fichier txt, avec une structuration et un codage permettant une construction de graphes d'adjacence et un traitement mathématique des données.

Mode d'emploi
-------------

### Inventaire des sources
Il existe deux entrées possibles pour accéder à cette base de donnée. Il est possible de faire une requête par le biais de l'onglet recherche avancée ou d'utiliser l'interface cartographique (onglet géolocalisation). L'outil de requête permet de rechercher tous les documents référencés par n'importe lequel des champs renseignés. On peut jouer avec les signes =, &lt;, &gt; ou &ne;. Par défaut, la recherche porte exactement sur l'expression indiquée. Pour obtenir une recherche souple, il suffit de rajouter une étoile"*", avant et/ou après le mot ou l'expression recherchée.

> exemple : une recherche "terrier" ne donnera que les documents dont le champs indique précisément "terrier". Une recherche *terrier* donnera tous les documents de type Livre terrier, ou terrier et arpentement...

Pour rechercher tous les documents illustrés par des photos ou des documents annexes, il suffit de faire une recherche sur ces champs en indiquant "1"

Le résultat de la requête peut donc apparaître soit sous la forme d'un tableau avec le nombre de documents obtenus.

