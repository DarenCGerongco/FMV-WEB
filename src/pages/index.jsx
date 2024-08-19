import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Index() {
  const url = import.meta.env.VITE_API_URL;

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [showMessageBox, setShowMessageBox] = useState(false);
  const navigate = useNavigate();

  const validateForm = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${url}/api/login`, {
        username,
        password,
      });

      if (response.status === 200) {
        localStorage.setItem('token', response.data.token);
        navigate('/overview');
      } else {
        setMessage('Invalid login credentials.');
        setShowMessageBox(true);
      }
    } catch (error) {
      const errorResponse = error.response?.data?.error || 'An error occurred during login.';
      let errorMessage = '';

      if (typeof errorResponse === 'object') {
        errorMessage = Object.values(errorResponse).flat().join(' ');
      } else {
        errorMessage = errorResponse;
      }

      setMessage(errorMessage);
      setShowMessageBox(true);
    }
  };

  const closeMessageBox = () => {
    setShowMessageBox(false);
  };

  return (
    <div className="flex h-screen bg-cover bg-center" style={{ backgroundImage: 'url(/src/assets/background.png)' }}>
      <div className="flex flex-col items-center justify-center h-full w-full">
        <div className="header-text">
          <h1 className="text-3xl font-extrabold mb-10 text-black">FMV Management System</h1>
        </div>
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="flex">
            <div className="w-2/3 bg-white p-8 py-10 rounded-xl">
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-4">LOGIN</h2>
                <form onSubmit={validateForm}>
                  <div className="mb-4 flex items-center border rounded-lg">
                    <img src="./src/assets/Username.png" alt="Username Icon" className="w-8 h-8 ml-4" />
                    <input
                      type="text"
                      id="username"
                      name="username"
                      className="w-full px-4 py-2 focus:outline-none"
                      placeholder="Username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>
                  <div className="mb-4 flex items-center border rounded-lg">
                    <img src="./src/assets/password.png" alt="Password Icon" className="w-8 h-8 ml-4" />
                    <input
                      type="password"
                      id="password"
                      name="password"
                      className="w-full px-4 py-2 focus:outline-none"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-36 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-3xl focus:outline-none focus:bg-blue-600"
                  >
                    Login
                  </button>
                </form>
              </div>
            </div>
            <div className="w-1/2 bg-blue-600 flex items-center justify-center">
              <img src="./src/assets/Logo.png" alt="Image" className="w-40 h-auto rounded-lg" />
            </div>
          </div>
        </div>
        {showMessageBox && (
          <div
            id="messageBox"
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg z-50"
          >
            <p id="messageText" className="text-lg font-semibold mb-4">
              {message}
            </p>
            <button
              onClick={closeMessageBox}
              className="block mx-auto bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none"
            >
              OK
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Index;
