# Skripte

Dies ist eine Zusammenstellung der Skripte, mit denen die Wärmestreifen und Karten im Artikel [So viel wärmer ist es bei Ihnen schon heute](https://www.zeit.de/wissen/umwelt/2019-12/klimawandel-globale-erwaermung-warming-stripes-wohnort) auf Zeit Online reproduziert werden können. Detaillierte Informationen zur Methodik befinden sich im Text und im Methodikkasten.

### Benötigte Tools

Die Skripte benötigen eine ganze Reihe an Kommandozeilen-Tools, um Daten umzuwandeln und zu bearbeiten.

- **[GDAL](https://gdal.org/index.html)** — .asc in GeoTIFF umzuwandeln.
- **[shapefile](https://github.com/mbostock/shapefile)** — Shapefile in GeoJSON umzuwandeln.
- **[rasterstats](https://github.com/perrygeo/python-rasterstats)** — GeoJSON mit einem GeoTIFF kombinieren und "Zonal Statistics" durchfügen.
- **[topojson](https://github.com/topojson/topojson)** — GeoJSON in TopoJSON umwandeln.
- **[ndjson-cli](https://github.com/mbostock/ndjson-cli)** — Unterstützung von Newline-delimited JSON
- **[geoproject](https://github.com/d3/d3-geo-projection/blob/master/README.md#geoProject)** — Kommandozeilenversion von d3-geo
- **[topojson-simplify](https://github.com/topojson/topojson-simplify/blob/master/README.md)** — TopoJSON vereinfachen
- **[convert](https://imagemagick.org)** — Funktion von Imagemagick, um SVG in PNG umzuwandeln.

Außerdem brauchen wir eine Reihe an npm-Modulen, die mit `$ npm install` installiert werden.

### 1. Temperaturdaten herunterladen

Die Daten zu den Durchschnittstemperaturen werden vom Deutschen Wetterdienst (DWD) als Open Data bereitsgestellt. Sie liegen als gzippte `.asc`-Daten vor. Diese können mit dem Shell Script `fetch-data.sh` alle auf einmal heruntergeladen werden.

```
$ ./fetch-data.sh
```

### 2. asc → geojson Extrahieren der Daten

Die Daten, die in den .asc-Files als einzelne Rasterpunkte vorliegen, werden nun einzelnen Gemeinden zugewiesen. Dafür wird jeweils ein .asc-File mit dem Shapefile der Gemeinden (Quelle: Bundesamt für Kartografie und Geodäsie (© GeoBasis-DE / BKG) mit Stand 31. Dezember 2017) kombiniert. Alle Rasterpunkte, die innerhalb einer Gemeinde liegen, werden addiert und der Mittelwert berechnet. Das Ergebnis wird als GeoJSON bzw. TopoJSON ausgegeben. Dafür wird der folgende Befehl benötigt:

```
$ ./asc-to-topo.sh
```

### 3. geojson → csv

Als nächstes werden die Temperaturdaten, die nun in einzelnen GeoJSONs – eines pro Jahr – bereit stehen, in ein `csv`-File schreiben, mit dem effizienter gearbeitet werden kann. Zudem brauchen wir die Daten nicht nach Jahr, sondern nach Gemeinde, um die Wärmestreifen zu berechnen.

```
$ node geojson-to-csv.js
```

### 4. csv → Wärmestreifen

Die Wärmestreifen werden mit einem node-Skript erstellt. Dieses lädt das `.csv`-File vom vorherigen Schritt und generiert ein Bild pro Zeile.

```
$ node create-warming-stripes.js
```

### 5. geojson + csv → Wärmekarten

Die Karten werden mit einem Shell-Script erstellt. Dabei wird aus jedem GeoJSON eine Karte erstellt. Da aber in jedem GeoJSON nur die Daten für jeweils ein jahr sind, ruft es zudem für jede Gemeinde `get-district-color.js` auf, welches wiederum das CSV aus Schritt 3 lädt und die entsprechende Temperaturabweichung berechnet. Auf einer Effizienzskala von langsam bis schnell liegt das wohl eher bei der megalangsam, aber es erfüllt den Zweck.

```
$ ./create-warming-maps.sh
```

Viel Erfolg beim Reproduzieren!
