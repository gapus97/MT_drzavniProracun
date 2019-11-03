from pyproj import Proj
from dbfread import DBF
from elasticsearch import Elasticsearch

es = Elasticsearch(
    ['localhost'],
    port=9200
)

# data used from https://egp.gu.gov.si/egp/ -> register prostorkih enot; koordinatni sistem 96
file = "OB.dbf"

# https://www.mkx.si/geoconv/
myProj = Proj("+proj=longlat +datum=WGS84 +to +proj=tmerc +lon_0=15E +ellps=GRS80 +x_0=500000 +y_0=-5000000 +k=0.9999 -f %.8f")


id = 0
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

    # push data to elastic
    es.index(index='states', doc_type='Blog', id=id, body=obj)
    id += 1

