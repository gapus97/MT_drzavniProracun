import { /*budgetCategories*/ supportedYears } from './Queries'; 
import { /*fetchData,*/ fetchAPIData } from '../dataFetcher/FetchStates';


const parseAllCategories = async (city) => {
    const data = await fetchAPIData(city, "allCategories");

    return data;
}

const getBudgetCategorie = async (city, categorie) => {
    const data = await fetchAPIData(city, categorie);
    return data;
}



const getCategoriesComparisonByYear = (data, categorie) => {
    let categorieComparison = [
        {
            2018: [],
            2017: [],
            2016: []
        }
    ];

    for(const year of Object.keys(supportedYears)) {
        const dataArray = data[0][year];

        for(let ct = 0; ct < dataArray.length; ct++){
            if (dataArray[ct].data.name.includes(categorie)) {
                categorieComparison[0][year].push(dataArray[ct].data);
            }
            for(var i = 0; i < dataArray[ct].data.children.length; i++) {
                let mainCategories = dataArray[ct].data.children[i];
                if (mainCategories.name.includes(categorie)) {
                    categorieComparison[0][year].push(mainCategories);
                    break;
                } 

                let subCategories = mainCategories.children;
                for(var j = 0; j < subCategories.length; j++) {
                    let subCategorie = subCategories[j];



                    if(subCategorie.name.includes(categorie)) {
                        categorieComparison[0][year].push(subCategorie);
                        break;
                    }

                    let subSubCategories = subCategorie.children;

                    

                    for(var k = 0; k < subSubCategories.length; k++) {
                        let subSubCategorie = subSubCategories[k];
                    
                        if(subSubCategorie.name.includes(categorie)) {
                            categorieComparison[0][year].push(subSubCategorie);
                            break;
                        }
                    }
                }
            }
        }
    }

    return categorieComparison;
}

const isDataValid = (data) => {
    let isDataValid = false;

   
    for(const yearKey of Object.keys(supportedYears)) {
        let yearData = data[0][yearKey];
        console.log(yearData);
        yearData.length > 0 ? isDataValid = true : isDataValid = false;
    }
    return isDataValid;
}

const parseMoney = (moneyData) => {
    if(moneyData)
        return (moneyData).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
}

export {
    //parseBudgetCategories,
    //parseBudgetCategorie,
    getCategoriesComparisonByYear,
    isDataValid,
    parseMoney,
    parseAllCategories,
    getBudgetCategorie
};