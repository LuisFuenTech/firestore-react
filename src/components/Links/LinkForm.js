import React, { useState, useEffect } from 'react';

import { db } from '../../config/firebase';
import { toast } from "react-toastify";

const LinkForm = (props) => {
  const initialState = {
    url: '',
    name: '',
    description: ''
  };

  const [values, setValues] = useState(initialState);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validURL(values.url)) {
      return toast('Invalid url', { type: 'warning', autoClose: 1000 });
    }

    await props.addOrEditLink(values);
    setValues({ ...initialState });
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setValues({
      ...values,
      [name]: value
    });
  };

  const validURL = (str) => {
    const pattern = new RegExp(
      '^(https?:\\/\\/)?' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$',
      'i'
    ); // fragment locator
    return !!pattern.test(str);
  };

  const getLink = async (id) => {
    const doc = await db.collection('links').doc(id).get();
    setValues({ ...doc.data(), id: doc.id });
  };

  useEffect(() => {
    if (!props.currentId) {
      setValues({ ...initialState });
    } else {
      getLink(props.currentId);
    }
  }, [props.currentId]);

  return (
    <form className="card card-body border-primary" onSubmit={handleSubmit}>
      <div className="form-group input-group">
        <div className="input-group-text bg-light">
          <i className="material-icons">insert_link</i>
        </div>
        <input
          onChange={handleInputChange}
          type="text"
          className="form-control"
          placeholder="https://someurl.com"
          name="url"
          value={values.url}
        />
      </div>

      <div className="form-group input-group">
        <div className="input-group-text bg-light">
          <i className="material-icons">create</i>
        </div>
        <input
          onChange={handleInputChange}
          type="text"
          className="form-control"
          placeholder="Website name"
          name="name"
          value={values.name}
        />
      </div>

      <div className="form-group">
        <textarea
          onChange={handleInputChange}
          name="description"
          rows="3"
          className="form-control"
          placeholder="Write a description"
          value={values.description}
        ></textarea>
      </div>

      <button className="btn btn-primary btn-block">
        {props.currentId ? 'Update' : 'Save'}
      </button>
    </form>
  );
};

export default LinkForm;
