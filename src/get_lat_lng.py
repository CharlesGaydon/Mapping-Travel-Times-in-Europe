import requests
import time
import random
import pandas as pd
import csv

"""
Created on Fri Dec  8 12:02:17 2017

@author: ppx
Saving latitude and longitude of main cities in a .csv file
"""

export_mode = True

file_in = "../docs/data/French-Cities.txt"
file_out = fileout = file_in[:-4]+"_lat_long.csv"
cities = pd.read_csv(file_in, header = None).transpose().values
cities = cities.tolist()[0]
nb_cities = len(cities)

### Getting the data with Google
liste_city_lat_long = []
latitudes = []
longitudes = []
for cit in cities:
    ok = False
    while ok == False:
        try:
            time.sleep(0.7* random.randint(1,7))
            request = 'https://maps.googleapis.com/maps/api/geocode/json?address='+ cit + 'Centre'
            response = requests.get(request)
            resp_json_payload = response.json()
            liste_city_lat_long.append([cit, resp_json_payload['results'][0]['geometry']['location']])
            latitudes.append(resp_json_payload['results'][0]['geometry']['location']['lat'])
            longitudes.append(resp_json_payload['results'][0]['geometry']['location']['lng'])
            ok = True
        except:
            print('oups')
            print(cit)

### Check
print(liste_city_lat_long)


### Export
l=len(liste_city_lat_long)
if export_mode:

    file = open(file_out, "w",encoding='utf-8')
 
    writer = csv.writer(file)

    entete=['City', 'lat','long']
    writer.writerow( entete )
 
#
# Écriture des quelques données.
    for i in range(0,len(latitudes)):
        xuxu=[liste_city_lat_long[i][0],latitudes[i],longitudes[i]]
        writer.writerow( xuxu )
    
    file.close()
                    




