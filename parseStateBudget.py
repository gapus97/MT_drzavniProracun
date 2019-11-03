# Reading an excel file using Python 
import xlrd

file = 'FK-2018-vsi-KONCNI-po_EK_na_K2.xls'

# Give the location of the file 
loc = (file)

# To open Workbook 
wb = xlrd.open_workbook(loc)

# read Odhodki
sheet = wb.sheet_by_index(5)

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
    sub = sub[2:]
    sub_categories.append(sub)

# read sub_sub categories (4th row)
sub_sub_categories = []
for i in range(3, sheet.ncols):
    # read forth row
    sub_sub = sheet.cell_value(4,i).replace("\n","")
    # remove number
    sub_sub = sub_sub[2:]
    sub_sub_categories.append(sub_sub)

# eq for all categories
print(main_categories.__len__(), sub_categories.__len__(), sub_sub_categories.__len__())

object_for_insert = {}
for i in range(main_categories.__len__()):
    main = main_categories[i]
    sub_cat = sub_categories[i]
    sub_sub_cat = sub_sub_categories[i]

    object_for_insert = {
        "id": "some id...",
        "main": main,
        "sub_cat": sub_cat,
        "sub_sub": sub_sub_cat,
        "value": "read that from xls column"
    }

    # insert thath object for insert into elastic search
    print(object_for_insert)


