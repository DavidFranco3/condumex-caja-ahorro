import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { map } from "lodash"
import LayoutPrincipal from "../layout/LayoutPrincipal";
import configRouting from './configRouting';

const Routing = ({ setRefreshCheckLogin }) => (
    <Router>
        <Routes>
            {map(configRouting, (route, index) => (
                <Route key={index} path={route.path} element={
                    <LayoutPrincipal setRefreshCheckLogin={setRefreshCheckLogin}>
                        <route.page setRefreshCheckLogin={setRefreshCheckLogin} />
                    </LayoutPrincipal>} >
                </Route>
            ))}
        </Routes>
    </Router>
)

export default Routing;
