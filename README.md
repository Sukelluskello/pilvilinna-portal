# Pilvilinna / Portaali
## Johdanto
Pilvilinna Portaali on web-käyttöliittymä Pilvilinna-palvelulle. Se on toteutettu Reactilla ja se käyttää Bootstrapia käyttöliittymän muotoiluun.

Pilvilinna on opetustarkoitukseen suunnattu palvelu, joka demonstroi erilaisia web-sovellusten haavoittuvuuksia. Huomioithan, että Pilvilinna sisältää tietoturva-aukkoja tarkoituksellisesti, joten sitä ei tule käyttää tuotantoympäristössä.

## Toiminnallisuus
Pilvilinna Portaalin avulla käyttäjät voivat tallentaa palveluun tiedostoja sekä niihin liittyviä muistiinpanoja. Käyttöliittymässä on tiedostojärjestelmä, joka noudattaa hierarkista rakennetta. Käyttäjillä on juuri ("/") ja sen alla voi olla tiedostoja tai kansioita. Jokaisella tiedostolla ja kansiolla voi olla "Lisätietoja"-kenttä.

## Asennus
Kloonaa projekti GitHubista ja asenna riippuvuudet:

```bash
git clone https://github.com/yourusername/pilvilinna-portal.git
cd pilvilinna-portal
npm install
```
Aja sovellus kehitystilassa:

```bash
npm start
```

Avaa selaimessa osoite http://localhost:3000 nähdäksesi sovelluksen.

## Käyttöönotto
Muokkaa tiedostoa src/config.js määrittääksesi API-palvelimen osoitteen.
Palvelun käyttö edellyttää Pilvilinna / API -palvelun asentamista (https://github.com/rscl/pilvilinna-api).

## Lisenssi
Pilvilinna Portaali on lisensoitu MIT-lisenssillä.