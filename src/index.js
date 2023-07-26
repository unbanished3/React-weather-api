import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css';

class App extends React.Component {

  constructor(props){
    super(props)
    this.input_ref = React.createRef() /*reference to input field*/
    this.state = 
      {
      request: "",
      records: [],
      api_key: "0e80e4236942473995d95437231703"
      }

    this.handleClick = this.handleClick.bind(this)
    this.hadleChange = this.hadleChange.bind(this)
  }

  hadleChange(event){
    this.setState({request: event.target.value})
  }

  /*click Function. Addes new rows to table*/
  handleClick = async (event) => {
    event.preventDefault();

    /*empty input shall not pass*/
    if(this.input_ref.current.value === ''){return}
    
    /*request*/
    await fetch(`https://api.weatherapi.com/v1/current.json?key=${this.state.api_key}&q=${this.state.request}&aqi=no`, {
      method: 'GET'
    }).then((Response) => Response.json())
    .then((data) => {
    
    /*invalid data shall not pass*/
      if(data.location === undefined){
        this.input_ref.current.value = ''
        return;
      }

    /*adding rows with required data*/
      this.setState(state => {
        const records = this.state.records.concat([{name: data.location.name, temp: data.current.temp_c}])
        this.input_ref.current.value = ''
        return{
          records,
          record: "",
        };
      })

    }) 
  }
  
  /* Delete Function*/
  DeleteRow = key => {
    this.setState(state => {
      const records = this.state.records.filter((item, index) => key !== index)
      return{
        records,
      }
    })
  }  

  render() {
    return(
    <>
      <form className='input_form' onSubmit={this.handleClick}>
        <input type="text" onChange={this.hadleChange} ref={this.input_ref}/>
        <button onClick={this.handleClick}>Send</button>
      </form>

      <table className='table'>

        <thead>
          <td>№</td>
          <td>Place</td>
          <td>temperature</td>
          <td></td>
        </thead>

        <tbody>
          {this.state.records.map((val, key) =>{
            return(
              <tr>
                <td>{key+1}</td>
                <td>{val.name}</td>
                <td>{val.temp}С°</td>
                <td><button onClick={() => this.DeleteRow(key)} className="delete_button">Delete</button></td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </>
    )
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App/>);