import React from 'react';
import Answer from "./Answer";
import Select from 'react-select';
// import fetch from 'node-fetch';
// import axios from "axios";
const translate = require("translate");
translate.engine = "google";

const languages = [
  {value: 'en', label: 'English', id: 0},
  {value: 'ru', label: 'Russian', id: 1},
  {value: 'fr', label: 'French', id: 2},
  {value: 'de', label: 'German', id: 3},
  {value: 'es', label: 'Spain', id: 4},
]

function App() {
  const [state, setState] = React.useState({
    text: 'Hello',
    answer: [{
      txt: 'Here you will see a translation',
      language: 'en',
      id: 0,
    }]
  });
  const [source, setSource] = React.useState({})
  const [language, setLanguage] = React.useState([])

  // useEffect(() => {
  //   fetch("http://localhost:5000/").then(res => res.json()).then(data => {
  //     setSource(data.source);
  //     setLanguage(data.language);
  //     setState(data.state);
  //   });
  // }, [])

  async function getTranslation(text, languages, from) {
    let translations = [];
    let index = 0;
    for (let language of languages) {
      const a = await translate(text, {to: language.value, from: from});
      const translation = {
        txt: a,
        language: language,
        id: index,
      }
      translations.push(translation);
      index++;
    }
    return translations;
    // return languages.map(async (language) => {
    //   const a = await translate(text, {to: language.value, from: from});
    //   return {txt: a, language: language};
    // });
  }

  async function handleChange(event) {
    setState({
      text: event.target.value,
      answer: state.answer,
    })
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const translations = await getTranslation(state.text, language, source.value);
    setState({
      text: state.text,
      answer: translations,
    })
  }

  return (
    <div className="upper">
      <Select
        className="select"
        options={languages}
        onChange={setSource}
        placeholder='Select source language here'
        isSearchable
      />
      <Select
        className="select"
        options={languages}
        onChange={setLanguage}
        placeholder='Select target languages here'
        isSearchable
        isMulti
        autoFocus
      />
      <form onSubmit={handleSubmit}>
        <label>
          <input className="form" id="input" size="50" type="text" value={state.text} onChange={handleChange} />
        </label>
        <input className="form" type="submit" value="Translate" />
      </form>
      <Answer translations={state.answer}/>
    </div>
  )
}

export default App;
