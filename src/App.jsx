import './App.css';
import Header from './Components/Header';
import Footer from './Components/Footer';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './Components/Login/Login';
import { UserStorage } from './UserContext';

function App() {
    return (
        <div className="App">
            <BrowserRouter>
                <UserStorage>
                    <Header />
                    <main className="AppBody">
                        <Routes>
                            <Route path="login/*" element={<Login />}></Route>
                        </Routes>
                    </main>
                    <Footer />
                </UserStorage>
            </BrowserRouter>
        </div>
    );
}

export default App;
