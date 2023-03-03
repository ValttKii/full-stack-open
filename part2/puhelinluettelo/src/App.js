import axios from 'axios'
import { useState, useEffect } from 'react'
import personService from './services/persons'


const Filter = (props) => {
  return (<div>
    filter shown with: <input
      value={props.condition}
      onChange={props.handleCondition} />
  </div>)
}
const AddNew = (props) => {
  console.log("ADD", props)
  return (<form onSubmit={props.addPerson}>
    <div>
      name: <input
        value={props.newName}
        onChange={props.handleNameChange} />
      <br />
      number: <input
        value={props.number}
        onChange={props.handleNumber} />
    </div>
    <div>
      <button onClick={props.btnAdd} type="submit">add</button>
    </div>
  </form>)
}
const Render = (props) => {
  return (<div>
    {props.persons
      .filter((human) => {
        if (!props.condition) return true
        if (human.name.toLowerCase().includes(props.condition)
          || human.number.includes(props.condition)
          || human.name.toUpperCase().includes(props.condition)
        ) {
          return true
        }
        return false
      })
      .map((human, i) => (
        <li key={i}>{human.name} {human.number}
          <button
            onClick={() => props.deletePerson(human.id)}
          >Delete</button></li>
      ))

    }
  </div>)
}
const Notification = (props) => {
  if (props.message === null)
    return null

  return (<div className="msg">
    {props.message}
  </div>)
}

const ErrorNotification = (props) => {
  if (props.errorMessage == null)
    return null

  return (<div className="error">
    {props.errorMessage}
  </div>)
} 

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [number, setNumber] = useState('')
  const [condition, setCondition] = useState('')
  const [message, setMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)


  useEffect(() => {
    personService
      .getAll()
      .then(res => {
        setPersons(res)
        console.log("P", persons)
      })
  }, [])


  const addPerson = (e) => e.preventDegault()
  const handleNameChange = (e) => setNewName(e.target.value)
  const handleNumber = (e) => setNumber(e.target.value)
  const handleCondition = (e) => setCondition(e.target.value)

  const btnAdd = (e) => {
    e.preventDefault()

    if (persons.some(person => person.name === newName)) {
      if (window.confirm(`${newName} is
       already added to phonebook, replace
        the old number with a new one?`)) {
        const person = persons.find(n => n.name === newName)
        const modifiedPerson = { ...person, number: number }

        personService
          .update(person.id, modifiedPerson)
          .then(res => {
            console.log(res)
            setMessage(`Updated ${res.name}`)
            setNewName('')
            setNumber('')
            
            setTimeout(() => {
              setMessage(null)
            }, 3000)
            setPersons(persons.map(person2 => person2.id !== person.id ? person2 : res))

          })
          //ei toimi
          .catch(error => {
           
            setErrorMessage(
              `Information of ${person.name} has already been removed from server`
            )
            setTimeout(() => {
              setErrorMessage(null)
            }, 5000)
            setPersons(persons.filter(n => n.id !== person.id))
          })
      }
    }
    else {
      const personObject = {
        name: newName,
        number: number
      }
      personService
        .create(personObject)
        .then(res => {
          setPersons(persons.concat(res))
          setMessage(`Added ${res.name}`)
          setNewName('')
          setNumber('')
          setTimeout(() => {
            setMessage(null)
          }, 3000)
        })
        
    }

  }
  const deletePerson = (id) => {
    const person = persons.find(n => n.id === id)
    if (window.confirm(`Delete ${person.name}?`)) {
      personService
        .deleteId(id)
        .then(res => {
          console.log("DEL", res)
          setPersons(persons.filter(n => n.id !== id))
          setMessage(`Deleted ${person.name}`)
          setTimeout(() => {
            setMessage(null)
          }, 3000)
        })
    }
  }

  return (
    <div>
      <Notification message={message} />
      <ErrorNotification errorMessage={errorMessage}/>
      <h2>Phonebook</h2>
      <Filter
        handleCondition={handleCondition}
        condition={condition} />
      <h2>Add a new</h2>
      <AddNew
        allPersons={persons}
        addPerson={addPerson}
        handleNameChange={handleNameChange}
        handleNumber={handleNumber}
        btnAdd={btnAdd}
        newName={newName}
        number={number}
      />
      <h2>Numbers</h2>
      <Render
        persons={persons}
        condition={condition}
        deletePerson={deletePerson} />
    </div>
  )

}

export default App
