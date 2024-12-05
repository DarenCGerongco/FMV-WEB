import { useState, useContext } from 'react';  // Import useContext
import { GlobalContext } from '../../GlobalContext';  // Import GlobalContext
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Index() {
  const url = import.meta.env.VITE_API_URL;
  const { setID } = useContext(GlobalContext);  // Access setID from the global context

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [showMessageBox, setShowMessageBox] = useState(false);
  const [loading, setLoading] = useState(false);  // Declare loading state
  const navigate = useNavigate();

  const validateForm = async (e) => {
    e.preventDefault();
    setLoading(true);  // Set loading to true while the request is being processed

    try {
      const response = await axios.post(`${url}/api/login`, { username, password });

      // console.log(response.data.user.user_type_id)

      const user_type = response.data.user.user_type_id

      if (response.status === 200 && user_type === 1) {
        localStorage.setItem('token', response.data.token);
        
        // Save userID in localStorage and GlobalContext after login
        localStorage.setItem('userID', response.data.user.id);  
        setID(response.data.user.id);  // Also set it in the global context

        navigate('/overview');  // Navigate without passing the id
      } 
      else if (user_type === 2){
        setMessage('Admin status require');
        setShowMessageBox(true);
      }
      
      else {
        setMessage('Invalid login credentials.');
        setShowMessageBox(true);
      }
    } catch (error) {
      const errorResponse = error.response?.data?.error || 'An error occurred during login.';
      setMessage(errorResponse);
      setShowMessageBox(true);
    } finally {
      setLoading(false);  // Stop loading after the request is done
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
                      disabled={loading}  // Disable input while loading
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
                      disabled={loading}  // Disable input while loading
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-3xl focus:outline-none focus:bg-blue-600 flex items-center justify-center"
                    disabled={loading}  // Disable button while loading
                  >
                    {loading ? (
                      <>
                        <div className="spinner"></div>  {/* Spinner animation */}
                        Loading...
                      </>
                    ) : 'Login'}  {/* Show Loading while processing */}
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
