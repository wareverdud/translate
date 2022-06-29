import React from 'react';
import'./Answer.css';
import PropTypes from 'prop-types'

function Answer({ translations }) {
  return (
    <div>
      {translations.map((translation) => {
        return (
          // <div key={translation.language.id}>
          <div key={translation.id}>
            <div className="txt" id="language">{translation.language.label}</div>
            <div className="txt">{translation.txt}</div>
          </div>
        )
      })}
    </div>
  )
}

Answer.propTypes = {
  translations: PropTypes.arrayOf(PropTypes.object),
}

export default Answer