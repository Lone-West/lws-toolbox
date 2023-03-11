# ZioPeraFinder

Tool per trovare le collisioni date coordinate X, Y, Z e raggio di ricerca. Utile per trovare le collisioni corrispondenti alla porzione del terreno di un modello di edificio che si vuole modificare.

Il programma richiederà in input le coordinate di cui si vuole cercare ed un raggio di ricerca, procederà a scansionare la cartella contenente tutti i file .xml e misurare la distanza. Se ricade entro il raggio inserito, allora verrà restituita la corrispondenza. Se la ricerca non dovesse produrre risultati verranno date in ordine crescente le collisioni più vicine trovate al punto specificato.

## Come usarlo

Bisogna prima installare NodeJS (versione LTS), ha un installer quindi non curerò i passaggi nella guida.

Una volta scaricato ZioPeraFinder ed entrati nella cartella, bisogna eseguire il seguente comando per scaricare le dipendenze: 
```
npm install
```

Effettuato il comando sarà sufficiente avviare lo script mediante
```
node app.js
```
e seguire i passaggi richiesti.

### NB.
Ricordati di inserire i numeri con la virgola usando il `.` come separatore decimale, ma vista la natura della ricerca può essere omessa la parte decimale senza compromettere la precisione dei risultati.

Consiglio inoltre di inserire il percorso alla cartella semplicemente trascinandola sulla riga di comando dall'esplora file (la inserisce in automatico).
