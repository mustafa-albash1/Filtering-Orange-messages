import React, { useState } from 'react';
import './App.css';
import * as XLSX from 'xlsx/xlsx.mjs';
import { saveAs } from 'file-saver';

const App = () => {
  // State to store the input text
  const [inputText, setInputText] = useState('');

  // State to store the extracted PIN numbers
  const [extractedPins, setExtractedPins] = useState([]);

  // State to store the extracted Serial numbers
  const [extractedSerial, setExtractedSerial] = useState([]);

  // Function to handle input text change
  const handleInputChange = (event) => {
    setInputText(event.target.value);
  };

  // Function to extract PIN numbers from the input text
  const extractPinFormOne = () => {
    // Regular expression to match 'Recharge PIN : ' followed by a set of numbers
    // Recharge PIN :  50962384205226     Serial Number : 	96277-416477433

    const pinRegex = /Recharge PIN : 	(\d+)/g;
    const serialRegex = /Serial Number : 	(\d+\-\d+)/g;

    // Match all occurrences of 'Recharge PIN : ' in the text
    const pinMatches = inputText.matchAll(pinRegex);
    const serialMatches = inputText.matchAll(serialRegex);
    // Extracted PIN numbers
    const extractedPinsArray = [];
    const extractedSerialArray = [];
    // Iterate over matches and add to the array
    for (const match of pinMatches) {
      extractedPinsArray.push(match[1]);
    }
    for (const match of serialMatches) {
      extractedSerialArray.push(match[1]);
    }

    // Update state with extracted PIN numbers
    setExtractedPins(extractedPinsArray);
    setExtractedSerial(extractedSerialArray);
  };

  // ***************************************************** //

  // Function to extract PIN numbers from the input text
  const extractPinFormTwo = () => {
    // Regular expression to match 'Recharge PIN : ' followed by a set of numbers
    // [Serial No:96277-420414803]    [PIN #: 86130028854166],

    const pinRegex = /PIN #: (\d+)/g;
    const serialRegex = /Serial No:(\d+\-\d+)/g;

    // Match all occurrences of 'Recharge PIN : ' in the text
    const pinMatches = inputText.matchAll(pinRegex);
    const serialMatches = inputText.matchAll(serialRegex);
    // Extracted PIN numbers
    const extractedPinsArray = [];
    const extractedSerialArray = [];
    // Iterate over matches and add to the array
    for (const match of pinMatches) {
      extractedPinsArray.push(match[1]);
    }
    for (const match of serialMatches) {
      extractedSerialArray.push(match[1]);
    }

    // Update state with extracted PIN numbers
    setExtractedPins(extractedPinsArray);
    setExtractedSerial(extractedSerialArray);
  };

  const handleExport = () => {
    // Create a new workbook
    const wb = XLSX.utils.book_new();

    // Create a worksheet with the two arrays as two columns
    const wsData = extractedPins.map((data1, index) => [
      data1,
      extractedSerial[index],
    ]);
    const ws = XLSX.utils.aoa_to_sheet([
      ['PIN Numbers', 'Serial Numbers'],
      ...wsData,
    ]);

    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet 1');

    // Save the workbook as an Excel file
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    saveAs(data, 'Sheet 1.xlsx');
  };

  return (
    <div className='content'>
      <button className='exportButton' onClick={handleExport}>
        Export
      </button>
      <textarea
        value={inputText}
        onChange={handleInputChange}
        placeholder='Paste text here...'
        rows={10}
        cols={50}
      />
      <div className='button-group'>
        <button className='buttonOne' onClick={extractPinFormOne}>
          Extract PIN (1)
        </button>
        <button className='buttonTwo' onClick={extractPinFormTwo}>
          Extract PIN (2)
        </button>
      </div>

      <div>
        <h2>Extracted PIN Numbers</h2>
        <table>
          <thead>
            <tr>
              <th>PIN Number</th>
              <th>Serial Number</th>
            </tr>
          </thead>
          <tbody>
            <td>
              {extractedPins.map((pin, index) => (
                <tr key={index}>
                  <td>{pin}</td>
                </tr>
              ))}
            </td>
            <td>
              {extractedSerial.map((serial, index) => (
                <tr key={index}>
                  <td>{serial}</td>
                </tr>
              ))}
            </td>
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default App;
