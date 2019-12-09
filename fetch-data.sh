#! /bin/bash

# Fetch raw gziped data from url

wget --no-parent --no-directories --directory-prefix=gemeinden-asc -r --accept .gz https://opendata.dwd.de/climate_environment/CDC/grids_germany/annual/air_temperature_mean/
cd gemeinden-asc
for f in *.gz
do
  open $f # To unzip them we simply open them which will run the default unzip tool
done
cd ..
