import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import LinkForm from './LinkForm';
import { db } from '../../config/firebase';

const Links = () => {
  const [links, setLink] = useState([]);
  const [currentId, setCurrentId] = useState('');

  const addOrEditLink = async (data) => {
    try {
      if (currentId) {
        await db.collection('links').doc(currentId).update(data);
        setCurrentId();
        toast('Link updated', {
          type: 'info',
          autoClose: 1500
        });
      } else {
        await db.collection('links').doc().set(data);
        toast('New link added', {
          type: 'success',
          autoClose: 1500
        });
      }
    } catch (error) {
      toast(error.message, {
        type: 'error',
        autoClose: 1500
      });
    }
  };

  const deleteLink = async (id) => {
    if (window.confirm('Are you sure you want to delete this?')) {
      await db.collection('links').doc(id).delete();
      toast('Link removed', {
        type: 'error',
        autoClose: 1500
      });
    }
  };

  const getLinks = () => {
    db.collection('links').onSnapshot((snapshot) => {
      const links = [];

      snapshot.forEach((doc) => {
        links.push({ ...doc.data(), id: doc.id });
      });

      setLink(links);
    });
  };

  useEffect(() => {
    getLinks();
  }, []);

  return (
    <>
      <div className="col-md-4 p-2">
        <LinkForm {...{ addOrEditLink, currentId, links }}></LinkForm>
      </div>

      <div className="col-md-8 p-2">
        {links.map((link) => (
          <div className="card mb-1" key={link.id}>
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <h5>{link.name}</h5>
                <div>
                  <i
                    className="material-icons text-danger"
                    onClick={() => deleteLink(link.id)}
                  >
                    close
                  </i>
                  <i
                    className="material-icons"
                    onClick={() => setCurrentId(link.id)}
                  >
                    create
                  </i>
                </div>
              </div>

              <p>{link.description}</p>
              <a href={link.url} target="_blank" rel="noopener noreferrer">
                Go to website
              </a>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Links;
