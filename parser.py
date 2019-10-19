import csv
from itertools import groupby
import pandas as pd
import matplotlib.pyplot as plt


file = "reb2019spl.csv"
data = pd.read_csv(file, encoding="utf-16", header=0, engine="python", sep='\t')

# parse data as dataframe
df = pd.DataFrame(data)
df['Rebalans proračuna 2019'] = df['Rebalans proračuna 2019'].str.replace(",",".")

# group data and aggregate sum
groupedData = df.groupby(['BLC_NAME','K2_NAME', 'K3_NAME' , 'K4_NAME']).agg({"Rebalans proračuna 2019": "sum"})


groupedData["Rebalans proračuna 2019"] = pd.to_numeric(groupedData["Rebalans proračuna 2019"].replace(",","."))

pd.pivot_table(groupedData, values = 'Rebalans proračuna 2019', index = 'BLC_NAME',
              columns = 'BLC_NAME',aggfunc ='count').plot.bar()

plt.show()
