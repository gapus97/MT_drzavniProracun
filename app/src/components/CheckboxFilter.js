import React from 'react';



class CheckboxFilter extends React.Component {
    constructor(props) {
        super(props) 
        this.state = {
            selectedOption:'youngFamily'
        }
        this.props.onChange(this.state.selectedOption);
    }

    handleOptionChange = (event) => {
        this.setState({
        selectedOption: event.target.value
        });
        this.props.onChange(event.target.value)
    }
  
    render() {
        return (
            <div className="list-group-item form-group">
                  {this.props.values.map((value, i) => (
                      <div className="radio" key={i} style={{display: 'flex', justifyContent: 'center'}}>
                          <label>
                              <input 
                                  onChange={this.handleOptionChange} 
                                  type='radio' 
                                  value={value}
                                  checked={this.state.selectedOption === value}      
                              />
                              {value}
                          </label>
                      </div>
                  ))}
            </div>
        )
    }
}

export default CheckboxFilter;