import { budgetCategories, supportedYears } from './Queries'; 
import { fetchData } from '../dataFetcher/FetchStates';


const parseBudgetCategories = async (city) => {
    let generalBudgetData = [
        {
            2018: [],
            2017: [],
            2016: []
        }
    ];

    for(const [key, value] of Object.entries(budgetCategories)) {
        for(const [yearKey, value] of Object.entries(supportedYears)) {
            
            let categorieData = await fetchData(city, key, value);
            //categorieData.key = key;
            generalBudgetData[0][yearKey].push(categorieData);
        }
    }
    
    return generalBudgetData;
}

const parseBudgetCategorie = async (city, categorie) => {
    let generalBudgetData = [
        {
            2018: [],
            2017: [],
            2016: []
        }
    ];

    for(const [yearKey, value] of Object.entries(supportedYears)) {
        let categorieData = await fetchData(city, categorie, value);
        
        if(categorieData) {
            categorieData.key = categorie;
            generalBudgetData[0][yearKey].push(categorieData);
        }
    }
    return generalBudgetData;
}


/**
 * Use that function for comparison graph for each categorie
 * @param {*} data 
 * @param {*} categorie 
 */
const getCategorieComparisonByYear = (data, categorie) => {
    console.log("Data arrived: ", data);
    console.log("Categorie: ", categorie);
    let categorieComparison = [
        {
            2018: [],
            2017: [],
            2016: []
        }
    ];

    for(const [year, arrayValue] of Object.entries(supportedYears)) {
        const dataArray = data[0][year];
        if (dataArray[0].name.includes(categorie)) {
            categorieComparison[0][year].push(dataArray[0]);
        }
        for(var i = 0; i < dataArray[0].children.length; i++) {
            let mainCategories = dataArray[0].children[i];
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
                //console.log("CHildrens: ", subSubCategories.length);

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

    console.log("Comparison: ", categorieComparison);
    return categorieComparison;


}

export {
    parseBudgetCategories,
    parseBudgetCategorie,
    getCategorieComparisonByYear
};