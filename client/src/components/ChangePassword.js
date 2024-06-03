import React, { useState } from 'react';
import { Link } from "react-router-dom";
import axios from 'axios';
import Sidebar from './Sidebar';

function ChangePassword({ token, role, handleLogout }) {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert('Hasła nie są identyczne');
      return;
    }

    try {
      const response = await axios.post('https://nodex.goplusbet.pl/api/users/change-password', {
        newPassword
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Hasło zostało zmienione');
    } catch (error) {
      alert('Nie udało się zmienić hasła');
      console.error(error);
    }
  };

  return (
    <>
    <Sidebar handleLogout={handleLogout} username={sessionStorage.getItem('username')} />
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow">
            <div className="card-header">
              <h5>Zmień hasło</h5>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="newPassword" className="form-label">Nowe hasło</label>
                  <input
                    type="password"
                    className="form-control"
                    id="newPassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    placeholder="Wpisz nowe hasło"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="confirmPassword" className="form-label">Potwierdź nowe hasło</label>
                  <input
                    type="password"
                    className="form-control"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    placeholder="Potwierdź nowe hasło"
                  />
                </div>
                <button type="submit" className="btn btn-success">Zmień hasło</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </>
  );
}

export default ChangePassword;
