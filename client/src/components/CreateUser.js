import React, { useState } from "react";
import axios from "axios";
import Sidebar from "./Sidebar";

function CreateUser({ handleLogout }) {
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [role, setRole] = useState("Admin");

  const handleUsernameChange = (e) => {
    const value = e.target.value.toLowerCase();
    setUsername(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newUser = { username, firstName, lastName, role };
      const token = sessionStorage.getItem("token"); // Pobierz token z sessionStorage
      const response = await axios.post("https://nodex.goplusbet.pl/api/users/register", newUser, {
        headers: {
          Authorization: `Bearer ${token}` // Dodaj token do nagłówków
        }
      });
      if (response.status === 201) {
        alert("Użytkownik zarejestrowany. Wiadomość z informacją o ustawieniu hasła została wysłana na podany adres e-mail.");
      } else {
        throw new Error("Błąd");
      }
    } catch (error) {
      alert("Błąd: " + error.response.data);
    }
  };

  return (
    <>
      <Sidebar handleLogout={handleLogout} username={sessionStorage.getItem('username')} />
      <div className="container my-5 d-flex justify-content-center align-items-center">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="card shadow">
              <div className="card-header text-dark">
                <h5>Stwórz nowego użytkownika</h5>
              </div>
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="username" className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      id="username"
                      value={username}
                      onChange={handleUsernameChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="firstName" className="form-label">Imię</label>
                    <input
                      type="text"
                      className="form-control"
                      id="firstName"
                      value={firstName}
                      onChange={e => setFirstName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="lastName" className="form-label">Nazwisko</label>
                    <input
                      type="text"
                      className="form-control"
                      id="lastName"
                      value={lastName}
                      onChange={e => setLastName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="role" className="form-label">Rola</label>
                    <select
                      id="role"
                      className="form-select"
                      value={role}
                      onChange={e => setRole(e.target.value)}
                    >
                      <option value="Admin">Admin</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Bukmacher">Bukmacher</option>
                      <option value="Bok">Bok</option>
                    </select>
                  </div>
                  <button type="submit" className="btn btn-success">Rejestruj</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CreateUser;
