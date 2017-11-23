#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
Created a long time ago in a galaxy far, far away

@author: ppx
"""
path_import = 'data/'
data_file = 'meilleurs-temps-des-parcours-des-trains.csv'


path_export = '/Users/ppx/Desktop/BP/data-science-script/exemple/result/'


import os
import csv
import sys
import pandas as pd
import numpy as np

def import_csv_file_into_list_of_dict(file_name):
    global path_import
    with open( path_import + file_name , 'r' , encoding = 'utf-8') as file:
        reader = csv.DictReader( file, delimiter = ";" )
        data_in_pyhton = list( reader )
    return data_in_pyhton

first_data = import_csv_file_into_list_of_dict(data_file)
gps_data = import_csv_file_into_list_of_dict('villes_france.csv')



def extract_names():
    global first_data
    
    for line in first_data:
        string = line['Relations']
        ville1 = []
        ville2 = []
        string = list(string)
        v1 = True
        v2 = False
        for x in string:
            if x == ' ':
                v1 = False
            if v1 == False and not (x == ' ' or x == '-'):
                v2 = True
            if v1:
                ville1.append(x)
            elif v2:
                ville2.append(x)
        line['Année'] = int(line['Année'])
        line['ville1'] = "".join(ville1)
        line['ville2'] = "".join(ville2)
extract_names()

def get_villes():
    global first_data
    villes = []
    for line in first_data:
        if not line['ville1'] in villes:
            villes.append(line['ville1'])
        if not line['ville2'] in villes:
            villes.append(line['ville2'])
    return villes


list_villes = get_villes()
df = pd.DataFrame(np.nan,index = list_villes, columns =list_villes)
def get_latest():
    global first_data, df
    
    result = []
    for ville1 in list_villes:
        for ville2 in list_villes:
            date_temps = [0,10000000]
            for line in first_data:
                if line['ville1'] == ville1 and line['ville2'] == ville2:
                    if not line['Temps estimé en minutes'] == '':
                        if line['Année'] > date_temps[0]:
                            date_temps = [line['Année'], float(line['Temps estimé en minutes'])]
            event = dict()
            if not date_temps[1] == 10000000:
                event['ville1'] = ville1
                event['ville2'] = ville2
                event['Temps'] = date_temps[1]
                result.append(event)
                df[ville1][ville2] = date_temps[1]
                df[ville2][ville1] = date_temps[1]
    return result                    

data = get_latest()


#! /usr/local/bin/python
#-*- coding: utf_8 -*-

#import dijkstra

class Graphe(object):
	"""Classe représentant un graphe.

	Un graphe est représenté par un dictionnaire.
	"""
	def __init__(self):
		"""Initialise le graphe à vide.
		"""
		self.graphe = {}

	def ajouteSommet(self, sommet):
		"""Ajoute un sommet au graphe sans aucun voisin.
		"""
		if sommet not in self.graphe.keys():
			self.graphe[sommet] = {}

	def ajouteArrete(self, sommet, sommetVoisin, p):
		"""Crée une arrête en reliant sommet avec sommetVoisin en associant le poids p.
		"""
		if sommet != sommetVoisin:

			self.graphe[sommetVoisin][sommet] = p
			self.graphe[sommet][sommetVoisin] = p


	def supprimeSommet(self, sommet):
		"""Supprime un sommet du graphe.
		"""
		for sommetVoisin in self.graphe[sommet].keys():
			del self.graphe[sommetVoisin][sommet]
		del self.graphe[sommet]

	def supprimeArrete(self, sommet, sommetVoisin):
		"""Supprime une arrête.
		"""
		if sommet in self.graphe[sommetVoisin]:
			self.supprimeSommet(sommet)
			self.supprimeSommet(sommetVoisin)






	def __eq__(self, graphe1):
		"""Compare deux graphes.
		"""
		return self.graphe == graphe1

	def __str__(self):
		"""Affichage du graphe.
		"""
		return repr(self.graphe)
	
	def __repr__(self):
		"""Représentation du graphe.
		"""
		return repr(self.graphe)
	def toListe(self):
		"""Affiche le graphe sous forme de listes d'adjacences.
		"""
		for i in sorted(self.graphe.keys()):
			print(self.graphe[i].keys())





graph = Graphe()
for ville in list_villes:
    graph.ajouteSommet(ville)
for line in data:
    graph.ajouteArrete(line['ville1'], line['ville2'], line['Temps'])
"""
	graph.ajouteArrete('A', 'C', 2)
	graph.ajouteArrete('D', 'B', 2)
	graph.ajouteArrete('B', 'C', 800)
	graph.ajouteArrete('B', 'D', 7)
	graph.ajouteArrete('C', 'D', 7)
	graph.ajouteArrete('F', 'A', 7)
	print graph
	print
	graph.toMatrice()
	print
	graph.toListe()
	print
	print graph.toXML()
	#print dijkstra.shortestPath(graph.graphe, 'A', 'B')






"""




