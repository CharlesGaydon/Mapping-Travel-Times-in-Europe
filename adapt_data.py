#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
Created a long time ago in a galaxy far, far away

@author: ppx
"""
path_import = '/Users/ppx/Desktop/M2\ DS/data_viz/DataViz-Project/data/'
data_file = 'meilleurs-temps-des-parcours-des-trains.csv'


path_export = '/Users/ppx/Desktop/BP/data-science-script/exemple/result/'


import os
import csv
import sys

def import_csv_file_into_list_of_dict(file_name):
    global path_import
    with open( path_import + file_name , 'r' , encoding = 'utf-8') as file:
        reader = csv.DictReader( file )
        data_in_pyhton = list( reader )
    return data_in_pyhton

first_data = import_csv_file_into_list_of_dict(data_file)
