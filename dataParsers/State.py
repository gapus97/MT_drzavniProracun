import json

class State:
    mainCatego = []
    sub_cate = {}
    sub_sub_cate = []
    def __init__(self, id, name):
        self.id = id
        self.name = name
        self.mainCategories = []
        #self.sub_categories = []
        #self.sub_sub_categories = []
        self.sumValue = None
        #self.data = []

    def addMainCategorie(self, name, value):
        self.mainCategories.append({name: value})

    def addMainCategories(self, mainCat):
        sub_cat = []
        sub_sub_cat = []
        self.mainCategories.append(mainCat)

    def updateMainCategories(self, main):
        self.mainCategories = main

    def addSubCategories(self,name, value):
        self.sub_categories.append({name: value})

    def addSubSubCategories(self, name, value):
        self.sub_sub_categories.append({name: value})

    def updateSumValue(self, value):
        self.sumValue = value

    def toJSON(self):
        return json.dumps(self, default=lambda o: o.__dict__,
                          sort_keys=True, indent=4)

    def print(self):
        print("Main: {}".format(self.mainCategories))
    def __str__(self):
        print("{} {} \n {} {} {}".format(self.name, self.mainCategories, self.sub_categories, self.sub_sub_categories, self.sumValue))