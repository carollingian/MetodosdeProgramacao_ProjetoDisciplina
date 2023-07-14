import React, { useState } from 'react';
import PropTypes from 'prop-types';

export default function PrefCheckBox({ name, onChange, checked }) {
  const [isChecked, setChecked] = useState(checked);

  const handleOnChange = () => {
    setChecked((current) => !current);
    onChange(); // Call the onChange callback passed from the parent component
  };

  return (
    <div>
      <input
        type="checkbox"
        checked={isChecked}
        onChange={handleOnChange}
        style={{ width: '17px', height: '17px' }}
      />
      <label style={{ color: 'white' }} htmlFor="livroCheckbox">
        {name}
      </label>
    </div>
  );
}

PrefCheckBox.propTypes = {
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired, // Add the onChange prop type
};
