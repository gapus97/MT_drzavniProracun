# Reading an excel file using Python
import xlrd
from elasticsearch import Elasticsearch
from elasticsearch import helpers

es = Elasticsearch(
    ['localhost'],
    port=9200
)

file = 'FK-2018-vsi-KONCNI-po_EK_na_K2.xls'

# Give the location of the file
loc = (file)

# To open Workbook
wb = xlrd.open_workbook(loc)

# read Odhodki, change if you want to parse other sheets
sheet = wb.sheet_by_index(2)

main_categories = []
# read first header - main categories
for i in range(3, sheet.ncols):
    main = sheet.cell_value(2,i).replace("\n","")
    # remove number
    main = main[2:]
    main_categories.append(main)

# read sub categories (3rd row)
sub_categories = []
for i in range(3, sheet.ncols):
    # read second row
    sub = sheet.cell_value(3,i).replace("\n","")
    # remove number
    sub = sub[4:]
    sub_categories.append(sub)

# read sub_sub categories (4th row)
sub_sub_categories = []
for i in range(3, sheet.ncols):
    # read forth row
    sub_sub = sheet.cell_value(4,i).replace("\n","")
    # remove number
    sub_sub = sub_sub[5:]
    sub_sub_categories.append(sub_sub)

# eq for all categories
print(main_categories.__len__(), sub_categories.__len__(), sub_sub_categories.__len__())

save_size = 100
states = []
row_id = 0
# read rows for states
for row in range(5,sheet.nrows):
    state_id = sheet.cell_value(row, 1)
    state_name = sheet.cell_value(row, 2)

    for col in range(3, sheet.ncols):
        search_index = col - 3
        main_cat = main_categories[search_index]
        sub_cat = sub_categories[search_index]
        sub_sub_cat = sub_sub_categories[search_index]
        state = {
            "id": state_id,
            "state_name": state_name,
            "main": main_cat,
            "sub_cat": sub_cat,
            "sub_sub": sub_sub_cat,
            "value": sheet.cell_value(row,col)
        }

        states.append({
            "_index": "investment_transfers", #change this for parsing other sheets
            '_op_type': 'index',
            "_type": "_doc",
            "_id": row_id,
            "_source": state,
        })
        row_id += 1

        # bulk insert
        if len(states) >= save_size:
            helpers.bulk(es, states)
            del states[0:len(states)]



if len(states) > 0:
    helpers.bulk(es, states)


# copy this http://localhost:9200/states_outcome/_search?pretty=true&q=*:*&size=50 to browser to get 50 records