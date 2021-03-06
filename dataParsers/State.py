import json

class State:
    mainCatego = []
    sub_cate = {}
    sub_sub_cate = []
    def __init__(self, id, name, year):
        self.id = id
        self.name = name
        self.children = []
        self.year = year
        self.value = None

    def addMainCategorie(self, name, value):
        self.children.append({name: value})

    def addMainCategories(self, mainCat):
        self.children.append(mainCat)

    def updateValue(self, value):
        self.value = value

    def toJSON(self):
        return json.dumps(self, default=lambda o: o.__dict__,
                          sort_keys=True, indent=4)

    def print(self):
        print("children: {}".format(self.children))
    def __str__(self):
        print("{} {} \n {}".format(self.name, self.children, self.value))