# Kata

## 1) Domain / use case / infrastructure
Refactorer le projet en déplaçant les fichiers dans 3 répertoires :
- domain
- use_case
- infrastructure


## 2) Candidat : port and adapter
### 2.1) ICandidatRepository
Extraire une interface `ICandidatRepository` de `CandidatRepository`

Injecter par constructeur cette interface dans `CandidatService`

## 2.2) Séparer le modèle Candidat du domaine de la persistance
Créer un nouveau model SQLCandidat pour le mapping SQL

Attention, l'interface doit toujours retourne un `Candidat` du domaine.

Renommer `CandidatRepository` en `SqlCandidatRepository`

Il faut mapper `Candidat` et `SQLCandidat` dans `SqlCandidatRepository` par respecter l'interface

Attention,  il faut modifier `Candidat` en `SQLCandidat` dans `connectToDatabase()` (`ìndex.ts`)

## 3) Recruteur : port and adapter
### 3.1) IRecruteurRepository
Extraire une interface `IRecruteurRepository` de `RecruteurRepository`

Injecter par constructeur cette interface dans `RecruteurService`

## 3.2) Séparer le modèle Recruteur du domaine de la persistance
Créer un nouveau model SQLRecruteur pour le mapping SQL

Attention, l'interface doit toujours retourne un `Recruteur` du domaine.

Renommer `RecruteurRepository` en `SqlRecruteurRepository`

Il faut mapper `Recruteur` et `SQLRecruteur` dans `SqlRecruteurRepository` par respecter l'interface

Attention,  il faut modifier `Recruteur` en `SQLRecruteur` dans `connectToDatabase()` (`ìndex.ts`)

## 4) Entretien : port and adapter
### 4.1) IEntretienRepository
Extraire une interface `IEntretienRepository` de `EntretienRepository`

Injecter par constructeur cette interface dans `EntretienService`

## 4.2) Séparer le modèle Entretien du domaine de la persistance
Créer un nouveau model SQLEntretien pour le mapping SQL

Attention, l'interface doit toujours retourne un `Entretien` du domaine.

Renommer `EntretienRepository` en `SqlEntretienRepository`

Il faut mapper `Entretien` et `SQLEntretien` dans `SqlEntretienRepository` par respecter l'interface

Attention,  il faut modifier `Entretien` en `SQLEntretien` dans `connectToDatabase()` (`ìndex.ts`)

## 5) Entretien : paramètres
Supprimer le couplage http dans `EntretienService` en introduisant par exemple un `enum` `Creation` qui sera retourné plutôt que de conserver `req: Request` et `res: Response` en paramètre de la méthode `create`
```
export enum Creation {
    HORAIRE,
    CANDIDAT_PAS_TROUVE,
    RECRUTEUR_PAS_TROUVE,
    PAS_COMPATIBLE,
    OK,
}
```

# 6) Candidat : paramètre
Remplacer les paramètres `req: Request` et `res: Response` de la méthode `create` par un `Candidat` du domaine.

Retourner un objet plutôt qu'utiliser le `res.status.send`

# 7) Recruteur : paramètre
Remplacer les paramètres `req: Request` et `res: Response` de la méthode `create` par un `Recruteur` du domaine.

Retourner un objet plutôt qu'utiliser le `res.status.send`

# 8) Entretien : use case
Extraire 2 use cases de `EntretienService` de ses 2 méthodes publiques :
- `CreerEntretien`
- `ListerEntretien`

Nommer les méthodes publiques des use case `execute` 

# 9) Candidat : use case
Extraire les use cases de `CandidatService` de ses méthodes publiques :
- `CreerCandidat`
- `ListerCandidats`
- `MettreAJourCandidat`
- `SupprimerCandidat`
- `SupprimerTousLesCandidats`
- `TrouverCandidat`

Nommer les méthodes publiques des use case `execute` 

# 10) Recruteur : use case
Extraire les use cases de `RecruteurService` de ses méthodes publiques :
- `CreerRecruteur`
- `ListerRecruteurs`
- `MettreAJourRecruteur`
- `SupprimerRecruteur`
- `SupprimerTousLesRecruteurs`
- `TrouverRecruteur`

Nommer les méthodes publiques des use case `execute` 

# 11) Notification
Extraire une interface `INotificationService` et injecter la dans `CreerEntretien`
