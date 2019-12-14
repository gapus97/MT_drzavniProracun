from pyproj import Proj
from dbfread import DBF
from elasticsearch import Elasticsearch
import csv

es = Elasticsearch(
    ['localhost'],
    port=9200
)

# data used from https://egp.gu.gov.si/egp/ -> register prostorkih enot; koordinatni sistem 96
file = "../OB.dbf"

# https://www.mkx.si/geoconv/
myProj = Proj("+proj=longlat +datum=WGS84 +to +proj=tmerc +lon_0=15E +ellps=GRS80 +x_0=500000 +y_0=-5000000 +k=0.9999 -f %.8f")


id = 0
states = []
for record in DBF(file, encoding="cp1250"):
    # state name
    name = record['OB_UIME']

    # coordinates in UTM format, WTF!
    x = record['CEN_E'] #as east
    y = record['CEN_N'] #as south

    lon, lat = myProj(x, y, inverse=True)

    obj = {
        "id": id,
        "name": name,
        "lon": lon,
        "lat": lat
    }

    states.append(obj)
    # push data to elastic
    #es.index(index='states', doc_type='Blog', id=id, body=obj)
    id += 1


with open("statesPopulation.csv", encoding="cp1250") as csv_file:
    csv_reader = csv.reader(csv_file, delimiter=',')
    line_count = 0
    for row in csv_reader:
        if line_count == 0:
            line_count += 1
            continue

        if len(row) > 2:
            state_name = row[1]
            indexOfSub = state_name.find("/")
            state_name = state_name[:indexOfSub]
            population = row[2]
            for state in states:
                if state_name in state["name"]:
                    index = states.index(state)
                    state["population"] = int(population)
                    states[index] = state
                    es.index(index='states', doc_type='Blog', id=state["id"], body=state)
            line_count += 1

