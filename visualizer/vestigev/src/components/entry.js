
import styles from './entry.module.css'
import { MdSearch,MdArrowForward } from "react-icons/md";
import React, { useState } from 'react';
import { JsonView, collapseAllNested, defaultStyles } from 'react-json-view-lite';
import 'react-json-view-lite/dist/index.css';


function EntriesSection({ entries, isLoading, fields,err,makeSearch}) {
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [fieldValues, setFieldValues] = useState({});
  const [limit,setLimit] = useState(1000);

  const handleInputChange = (event) => {
    const newValue = event.target.value;
    const regex = /^[0-9\b]+$/;
    if (newValue === "" || regex.test(newValue)) {
      setLimit(newValue);
    }
    
  };
  const openModal = (entryText) => {
    setSelectedEntry(entryText);
  };

  const closeModal = () => {
    setSelectedEntry(null);
  };

  const handleFieldValueChange = (fieldName, value) => {
    setFieldValues((prevFieldValues) => ({
      ...prevFieldValues,
      [fieldName]: value,
    }));
  };

  const createJsonObjectAndPassToParent = () => {
    function sanitizeObject(obj) {
      const sanitizedObj = {};
      for (const key in obj) {
        if(typeof obj[key]=='function') continue;
        if (obj.hasOwnProperty(key) && obj[key] !== '') {
          sanitizedObj[key] = obj[key];
        }
      }
      return sanitizedObj;
    }
    const processedJsonObject = sanitizeObject(fieldValues);
    makeSearch(processedJsonObject,limit||1000);
  };

    return (
      <div className={styles.entriessection}>

        <div className={styles.fieldslist}>
            <div className={styles.fieldheader}>
                <MdSearch size={24} className={styles.searchico} onClick={createJsonObjectAndPassToParent}/>
                <div>
                 Limit:  <input className={styles.limitinput} value={limit} onChange={handleInputChange}  pattern="[0-9]*"></input>
                </div>
            </div>
            {err?<span>An Error has occurred</span>:isLoading? (<div>Loading...</div>):
            <div>
              Available keys {err? <span>err</span>: isLoading? <span>(...)</span>:<span>({fields.length})</span>}
              {fields.map((field, index) => (<Field key={index} label={field} onFieldValueChange={handleFieldValueChange} fieldValues={fieldValues}/>))}
              </div>
            }
        </div>


        <div className={styles.entrieslist}>
            <div className={styles.entriesheader}>
            {err? <span>err</span>: isLoading? <span>...</span>:<span>{entries.length}</span>} Hits
            </div>
          {err?<span>An Error has occurred</span>:isLoading ? (
            <div>Loading...</div>
          ) :
            (entries.map((entry, index) => (
              <Entry key={index} entry={entry} openModal={openModal} />
            )))
          }
        </div>
        {selectedEntry && (
          <Modal closeModal={closeModal} entryText={selectedEntry} />
        )}     
      </div>
    );
}
  
function Field({ label, onFieldValueChange, fieldValues }) {
  const inputValue = fieldValues[label] || '';

  const handleInputChange = (event) => {
    const newValue = event.target.value;
    onFieldValueChange(label, newValue);
  };

    return (
        <div className={styles.field}>
        <div className={styles.fieldlabel}>{label}</div>
        <input 
        className={styles.fieldinput} 
        value={inputValue}
        onChange={handleInputChange}
        ></input>
        </div>
    );
}

function Entry({ entry,openModal }) {
  return (
      <div className={styles.entry}>
        <div className={styles.entryleft}>{JSON.stringify(entry)}</div>
        <div className={styles.entryright} onClick={() => openModal(entry)}>
            <span className={styles.entryarrow}><MdArrowForward className={styles.ico}/></span>
        </div>
      </div>
  );
}

function Modal({ closeModal, entryText }) {
  return (
    <div className={styles.modaloverlay}>
      <div className={styles.modal}>
        <div className={styles.modalcontent}>
          <button className={styles.modalclose} onClick={closeModal}>
            X
          </button>
          <JsonView data={entryText} shouldInitiallyExpand={collapseAllNested} style={defaultStyles} />
        </div>
      </div>
    </div>
  );
}
export default EntriesSection;