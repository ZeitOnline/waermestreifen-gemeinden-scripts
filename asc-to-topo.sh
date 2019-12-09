#! /bin/bash

# 1. Changes projection,
# 2. Applies zonal statistic to get data on per district basis
# 3. Converts to topojson

cd gemeinden-asc
mkdir -p temp-geotifs
for f in *.asc
do
  file_name=`echo $f | cut -d'.' -f 1`
  echo "Processing file ${file_name}"
  gdalwarp -s_srs EPSG:31467 -t_srs EPSG:4326 $f "./temp-geotifs/${file_name}.tif"
  shp2json ../gemeinden-shape/2017vwg-big.shp | rio zonalstats -r "./temp-geotifs/${file_name}.tif" --stats "mean" > ./zonal-geo.temp.json
  geo2topo districts=./zonal-geo.temp.json -q 1e6 -o "../gemeinden-years-topo/${file_name}.json"
done
rm ./zonal-geo.temp.json
rm -r ./temp-geotifs
cd ..