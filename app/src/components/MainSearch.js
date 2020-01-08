import React from 'react';
import Autosuggest from 'react-autosuggest';
import CheckboxFilter from './CheckboxFilter';
import { supportedFilters } from '../utils/Queries';
import Button from 'react-bootstrap/Button';

class MainSearch extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            value: '',
            stateSuggestions: [],
            checkboxesValue: ''
        };
    }

    getSuggestions = (value) => {
        const inputValue = value.trim().toLowerCase();
        const inputLength = inputValue.length;

        return inputLength === 0 ? [] : this.props.stateData.filter(state =>
          state.name.toLowerCase().slice(0, inputLength) === inputValue
        );
    }

    renderSuggestion = (suggestion) => {
        return (
            <span>{ suggestion.name } </span>
        );
    }

    onChange = (event,  { newValue }) => {
        this.setState({
            value: newValue
        });
    }

    onSuggestionsFetchRequested = ({ value }) => {
        let suggestion = this.getSuggestions(value);
        

        if(suggestion.length === 1) {
            this.props.searchData(suggestion);
        }

        this.setState({
            stateSuggestions: suggestion
        });
    };

    onSearchControlChange = (event) => {
        if (event.target.value) {
            this.props.searchData(event.target.value);
        }
        
    }

    onSuggestionsClearRequested = () => {
        this.setState({
          stateSuggestions: []
        });
    };

    getSuggestionValue = ( suggestion ) => {
        this.props.searchData(suggestion);
        return suggestion.name;
    }

    onCheckboxChange = (name, values) => {
        console.log("Child 1", values);
        //https://jsbin.com/tusakexire/edit?html,js,output
        //this.setState({ [name]: values })
        this.setState({
            checkboxesValue: values
        });
        //this.props.checkboxValue(values);
    }

    handleButtonClick = () => {
        console.log(this.state.stateSuggestions);
        this.props.executeSearch(this.state.checkboxesValue);
    }

    render() {   

        const { value, stateSuggestions } = this.state;
        // Autosuggest will pass through all these props to the input.
        const inputProps = {
            placeholder: '',
            onChange: this.onChange,
            value: value
        };

        if(stateSuggestions.length === 1) {
            // pass data to root (Main.js), to map to this location
            this.props.searchData(stateSuggestions);
        }



        return (
           
                <div className="mainSearch">
                    <h4> Vpišite ime občine v katero bi se radi preselili </h4>
                    {   this.props.stateData ?  
                        <Autosuggest
                            suggestions={stateSuggestions}
                            onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                            onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                            getSuggestionValue={this.getSuggestionValue}
                            renderSuggestion={this.renderSuggestion}
                            inputProps={inputProps}
                        /> : ""
                    }

                    <CheckboxFilter values={supportedFilters} onChange={(values) => this.onCheckboxChange('write', values)} />
                    <Button variant="primary" size="lg" active onClick={this.handleButtonClick} style={{marginTop: 10, marginBottom: 20}}>
                        Potrdi vnos
                    </Button>
                </div>
           
 
        );
    }
}

export default MainSearch;