import { HashRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import AdminDashboard from "./Components/AdminDashboard";
import EventImages from "./Components/EventImages";
// import LicenseKey from "./Components/LicenseKey";
import Login from "./Components/Login";

function App() {
	return (
		<HashRouter>
			<Routes>
				{/* <Route path="/" element={<LicenseKey />} /> */}
				<Route path="/" element={<Login />} />
				<Route path="/adminDashboard" element={<AdminDashboard />} />
				<Route path="/eventImages" element={<EventImages />} />
			</Routes>
		</HashRouter>
	);
}

export default App;
