import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Home from './pages/Home/Home';
import CargoCatalog from './pages/CargoCatalog/CargoCatalog';
import CargoDetail from './pages/CargoDetail/CargoDetail';

const App = () => {
    return (
        <Router>
            <Layout>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/cargo-catalog" element={<CargoCatalog />} />
                    <Route path="/cargo-detail/:id" element={<CargoDetail />} />
                </Routes>
            </Layout>
        </Router>
    );
};

export default App;