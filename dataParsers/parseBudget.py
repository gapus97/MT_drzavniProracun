import csv
import pandas as pd
from elasticsearch import Elasticsearch
es = Elasticsearch(
    ['localhost'],
    port=9200
)

file = "reb2019spl.csv"
data = pd.read_csv(file, encoding="utf-16", header=0, engine="python", sep='\t')

with open(file, mode='r', encoding='utf-16') as csv_file:
    csv_reader = csv.DictReader(csv_file, delimiter='\t')
    line_count = 0
    for row in csv_reader:
        # delete unnecessary columns
        del row['K4_ID']
        del row['K3_ID']
        del row['K2_ID']
        del row['BLC_ID']

        #make column in millions
        row['Rebalans proračuna 2019'] = pd.to_numeric(row['Rebalans proračuna 2019'].replace(",", ".")) / 1000000

        # push data into elasticsearch
        es.index(index='proracun', body=row)
        line_count += 1

