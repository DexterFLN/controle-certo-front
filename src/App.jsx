import './App.css';
import Header from './Components/Header';
import Footer from './Components/Footer';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './Components/Login/Login';
import { UserStorage } from './UserContext';
import ProtectedRoute from './Components/Helper/ProtectedRoute';
import User from './Components/User/User';
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
function App() {
    return (
        <div className="App">
            <BrowserRouter>
                <UserStorage>
                    <Header />
                    <main className="AppBody">
                        <Routes>
                            <Route path="/" element={<Login></Login>}></Route>
                            <Route path="login/*" element={<Login />}></Route>
                            <Route
                                path="user/*"
                                element={
                                    <ProtectedRoute>
                                        <User />
                                    </ProtectedRoute>
                                }
                            ></Route>
                        </Routes>
                    </main>
                    <Footer />
                </UserStorage>
            </BrowserRouter>
            <ToastContainer/>
        </div>
    );
}

export default App;
