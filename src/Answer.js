import React from 'react';
import './Answer.css';

export default function Answer({ translations }) {
  return (
    <div>
      {translations.map((translation) => {
        return (
          <div key={translation.id}>
            <div className="txt" id="language">
              {translation.language.label}
            </div>
            <div className="txt">{translation.txt}</div>
          </div>
        );
      })}
    </div>
  );
}
