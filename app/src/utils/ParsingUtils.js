import { budgetCategories, supportedYears } from './Queries'; 
import { fetchData, fetchAPIData } from '../dataFetcher/FetchStates';
import { allCategories } from '../utils/Queries';


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

const parseAllCategories = async (city) => {
    const data = await fetchAPIData(city, "allCategories");

    return data;
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


const getBudgetCategorie = async (city, categorie) => {
    const data = await fetchAPIData(city, categorie);
    return data;
}


/**
 * Use that function for comparison graph for each categorie
 * @param {*} data 
 * @param {*} categorie 
 */
const getCategorieComparisonByYear = (data, categorie) => {
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


const getCategoriesComparisonByYear = (data, categorie) => {
    let categorieComparison = [
        {
            2018: [],
            2017: [],
            2016: []
        }
    ];

    for(const [year, arrayValue] of Object.entries(supportedYears)) {
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

    //console.log("Comparison: ", categorieComparison);
    return categorieComparison;


}

const isDataValid = (data) => {
    let isDataValid = false;

   
    for(const [yearKey, value] of Object.entries(supportedYears)) {
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
    parseBudgetCategories,
    parseBudgetCategorie,
    getCategorieComparisonByYear,
    getCategoriesComparisonByYear,
    isDataValid,
    parseMoney,
    parseAllCategories,
    getBudgetCategorie
};