# Reading an excel file using Python 
import xlrd
from elasticsearch import Elasticsearch
from dataParsers.State import State

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
sheet = wb.sheet_by_index(5)

main_categories = []
# read first header - main categories
for i in range(3, sheet.ncols):
    main = sheet.cell_value(2,i).replace("\n","")
    # remove number
    if "SKUPAJ" not in main:
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
    state_name = sheet.cell_value(row, 2).replace("OBČINA","").replace("MESTNA","").replace(" ", "")

    stateClass = State(state_id, state_name)
    previous_main = ""
    previous_sub = ""
    previous_sub_sub = ""

    for col in range(3, sheet.ncols):
        search_index = col - 3
        main_cat = main_categories[search_index]
        sub_cat = sub_categories[search_index]
        sub_sub_cat = sub_sub_categories[search_index]
        value = sheet.cell_value(row,col)


        # MAIN categories parse
        if previous_main != main_cat and sub_cat == '' and sub_sub_cat == '':
            stateClass.updateSumValue(value)
            main_obj = {
                'name': main_cat,
                "sub_cat": [
                ],
                "value": value
            }
            stateClass.addMainCategories(main_obj)

        # PARSE sub categories, add thath sub categorie to sub array of main categorie
        elif previous_main == main_cat and sub_cat != '' and previous_sub != sub_cat and sub_sub_cat == '':
            for main in stateClass.mainCategories:
                if main['name'] == main_cat:
                    index = stateClass.mainCategories.index(main)
                    sub_cat_arr = main["sub_cat"]
                    sub_cat_arr.append({
                        "name": sub_cat,
                        "sub_sub_cat": [

                        ],
                        "value": value
                    })
                    # update index
                    main["sub_cat"] = sub_cat_arr
                    stateClass.mainCategories[index] = main
                    break


        # parse sub-sub categories
        if previous_sub == sub_cat and sub_cat != '' and sub_sub_cat != '' and previous_sub_sub != sub_sub_cat:
            for main in stateClass.mainCategories:
                if main["name"] == main_cat:
                    # get sub-cat array
                    m = main['sub_cat']
                    main_index = stateClass.mainCategories.index(main)
                    for sub in m:
                        if sub["name"] == sub_cat:
                            # append sub-sub categorie into sub-categorie: [ sub-sub: [...apend here]]
                            sub_sub_arr = sub["sub_sub_cat"]
                            sub_sub_arr.append({
                                "name": sub_sub_cat,
                                "value": value
                            })
                            sub["sub_sub_cat"] = sub_sub_arr
                            break

        row_id += 1
        previous_main = main_cat
        previous_sub = sub_cat
        previous_sub_sub = sub_sub_cat

    #states.append(stateClass)
    es.index(index='states_outcome2', doc_type='doc', id=state_id, body=stateClass.toJSON())


# copy this http://localhost:9200/states_outcome/_search?pretty=true&q=*:*&size=50 to browser to get 50 records

#for e in states:
#    e.print()


'''
Structure:
"mainCategories": [
      {
        "name": "JAVNA UPRAVA",
        "sub_cat": [
          {
            "name": "Dejavnosti izvršilnih in zakonodajnih organov, ter dejavnosti s področja finančnih in fiskalnih ter zunanjih zadev",
            "sub_sub_cat": [
              {
                "name": "Dejavnosti izvršilnih in zakonodajnih organov",
                "value": 1508218.26
              },
              {
                "name": "Dejavnosti s področja finančnih in fiskalnih zadev",
                "value": 4090.3
              },
              {
                "name": "Dejavnosti s področja zunanjih zadev",
                "value": 0
              }
            ],
            "value": 1512308.56
          },
          {
            "name": "Gospodarska pomoč drugim državam",
            "sub_sub_cat": [
              {
                "name": "Gospodarska pomoč drugim državam",
                "value": 0
              }
            ],
            "value": 0
          }
        ],
        value: 123423423
      }
]

Example for 1 main categorie, sub-cat and sub-sub cat

State
    - name
    - id
    - main categories [{
        - name
        - value
        - sub-categories: [{ //array of sub-categories, each sub-categorie is a object ob name, value and array of sub-sub categories
            -name
            -value
            -sub-sub-cat: [{
                -name
                -value
            },]
        }]
    }]

'''