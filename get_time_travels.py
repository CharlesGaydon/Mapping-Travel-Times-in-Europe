import googlemaps
from datetime import datetime
import time
import copy
import numpy as np
import pandas as pd
"""
Author : Charles Gaydon
Last edited : 23/11/2017
Saving travel times for train journey from a list of cities in Europe. 
"""
key = 'AIzaSyDe_eNdfeT9KSIGFuMzq4nWqilB8J84sk8' #keep it private ! 
client = googlemaps.Client(key=key)


file_in = "data/French_Cities.txt"
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
df = pd.DataFrame(distance_matrix, columns = cities)
df.insert(0,"Cities" ,cities)
df.to_csv(fileout,index = False)
print("Results saved in : "+fileout)
#A FAIRE : moyenner les cotés symétriques
#Enfin : répéter toute l'opération plusieurs jours pour être sur d'avoir un min,
# puis faire dijsktra sur matrice obtenue pour remplir les nan.



