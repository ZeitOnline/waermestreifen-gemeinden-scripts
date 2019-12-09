#! /bin/bash

# Takes a folder of geojsons, colors them according to a property and creates svg and png maps

svg_folder="gemeinden-maps-svg"
png_folder="gemeinden-maps"

mkdir -p ${svg_folder}
mkdir -p ${png_folder}

i=0

cd gemeinden-years-topo
for f in *.json
do
  file_name=`echo $f | cut -d'.' -f 1`
  echo "Processing ${file_name}"

  toposimplify -p 1 -f $f | \
    topo2geo districts=- | \
    ndjson-map -r getColor=../get-district-color.js "d.features.forEach(f => f.properties.fill = getColor(f, ${i})), d" | \
    geoproject 'd3.geoMercator().fitSize([100, 100], d)' | \
    ndjson-split 'd.features' | \
    geo2svg -n --stroke none -p 1 -w 100 -h 100 > "../${svg_folder}/${file_name}.svg"

  convert "../${svg_folder}/${file_name}.svg" "../${png_folder}/${file_name}.png"
  i=$(( i + 1 ))
done
cd ..