import json

class State:
    def __init__(self, id, name):
        self.id = id
        self.name = name
        self.mainCategories = []
        self.sub_categories = []
        self.sub_sub_categories = []
        self.sumValue = None

    def addMainCategorie(self, name, value):
        self.mainCategories.append({name: value})

    def addSubCategories(self,name, value):
        self.sub_categories.append({name: value})

    def addSubSubCategories(self, name, value):
        self.sub_sub_categories.append({name: value})

    def updateSumValue(self, value):
        self.sumValue = value

    def toJSON(self):
        return json.dumps(self, default=lambda o: o.__dict__,
                          sort_keys=True, indent=4)

    def __str__(self):
        print("{} {} \n {} {} {}".format(self.name, self.mainCategories, self.sub_categories, self.sub_sub_categories, self.sumValue))