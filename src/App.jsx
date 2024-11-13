import { useState, useEffect } from 'react';
import Routing from "./routers/Routing";
import Login from "./page/Login";
import { AuthContext } from "./utils/contexts";
import { isUserLogedApi } from "./api/auth";
import { ToastContainer } from "react-toastify";
import './App.scss';

function App () {
    const [user, setUser] = useState(null);
    const [LoadUser, setLoadUser] = useState(false);
    const [refreshCheckLogin, setRefreshCheckLogin] = useState(false);

    useEffect(() => {
        setUser(isUserLogedApi())
        setRefreshCheckLogin(false)
        setLoadUser(true)
    }, [refreshCheckLogin]);

    if (!LoadUser) return null;

    return (
        <>
            <AuthContext.Provider value={user}>
                {
                    user ?
                        (
                            <>
                                <Routing
                                    setRefreshCheckLogin={setRefreshCheckLogin}
                                />
                            </>
                        )
                        :
                        (
                            <>
                                <Login
                                    setRefreshCheckLogin={setRefreshCheckLogin}
                                />
                            </>
                        )
                }

                <ToastContainer
                    position="top-right"
                    autoClose={5000}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnVisibilityChange
                    draggable
                    pauseOnHover
                />
            </AuthContext.Provider>
        </>
    );
}

export default App;
