import googlemaps
from datetime import datetime
import time
import copy
import numpy as np
import pandas as pd
import requests
"""
Author : Charles Gaydon
Last edited : 23/11/2017
Saving travel times for train journey from a list of cities in Europe. 
"""


### GETTING THE DATA
key = 'AIzaSyDe_eNdfeT9KSIGFuMzq4nWqilB8J84sk8' #keep it private ! 
client = googlemaps.Client(key=key)
file_in = "../data/French_Cities.txt"
fileout = file_in[:-4]+"_Matrix.txt"
print("\nLoading cities from : "+file_in)
cities = pd.read_csv(file_in).transpose().values
cities = cities.tolist()[0]
nb_cities = len(cities)
print("Cities considered are : ")
print(str(cities))

when=time.mktime(time.strptime('29/11/2017:8', "%d/%m/%Y:%H"))
now = datetime.fromtimestamp(when)
results = client.distance_matrix(cities, cities,
                                            mode="transit",
                                            language="en-AU",
                                            departure_time=when,
                                            transit_mode="rail")
distance_matrix = np.array([[0.0]*nb_cities]*nb_cities)
for i, cit in enumerate(cities):
    for j in range(nb_cities):
        if results["rows"][i]["elements"][j]["status"]=='ZERO_RESULTS':
            distance_matrix[i,j] = np.nan
        else :
            distance_matrix[i,j] = results["rows"][i]["elements"][j]['duration']['value']  


### GETTING LAT & LONG
liste_city_lat_long = []
for cit in enumerate(cities):
    request = 'https://maps.googleapis.com/maps/api/geocode/json?address='+ cit +'Centre'
    response = requests.get(request)

    resp_json_payload = response.json()
    liste_city_lat_long.append([cit, resp_json_payload['results'][0]['geometry']['location']])


### FILLING MISSING DATA

factor = 60*60
distance_matrix/=factor


where_nan = [frozenset(x) for x in np.argwhere(np.isnan(distance_matrix))]
where_nan = set(where_nan)
couples = []
for j in where_nan:
    couples.append(list(j))
where_nan = couples
#print(where_nan)
np.nan_to_num(distance_matrix,999)

#Implémenter dijsktra pour chaque couple de where_nan !

### AVERAGING 
distance_matrix*=factor
distance_matrix = (distance_matrix+ distance_matrix.transpose())/2

### SAVING
df = pd.DataFrame(distance_matrix, columns = cities)
df.insert(0,"Cities" ,cities)
df.to_csv(fileout,index = False)
print("Results saved in : "+fileout)
#A FAIRE : moyenner les cotés symétriques
#Enfin : répéter toute l'opération plusieurs jours pour être sur d'avoir un min,
# puis faire dijsktra sur matrice obtenue pour remplir les nan.




