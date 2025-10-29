import { Routes, Route } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";

import Home from "./pages/Home";
import Login from "./pages/Login";
import RegisterPage from "./pages/RegisterPage";
import Dashboard from "./pages/Dashboard";
import Notes from "./pages/Notes";
import PanelLayout from "./pages/PanelLayout";
import Tasks from "./pages/Tasks";
import ReminderPage from "./pages/ReminderPage";
import EditProfile from "./pages/EditProfile";
import ComoUsarMilo from "./pages/ComoUsarMilo";
import Novedades from "./pages/Novedades";

import { ThemeProvider } from "./context/ThemeContext";
import ThemeToggle from "./components/ThemeToggle";
import PrivateRoute from "./components/PrivateRoute";

const CalendarioPage = () => <h1>Calendario y recordatorios</h1>;
const ConfigPage = () => <h1>Opciones de Configuración</h1>;

function App() {
  return (
    <ThemeProvider>
      {/* Rutas de la app */}
      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/como-usar-milo" element={<ComoUsarMilo />} />
        <Route path="/novedades" element={<Novedades />} />

        {/* Rutas privadas */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/panel"
          element={
            <PrivateRoute>
              <PanelLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<></>} />
          <Route path="notas" element={<Notes />} />
          <Route path="tareas" element={<Tasks />} />
          <Route path="recordatorios" element={<ReminderPage />} />
          <Route path="calendario" element={<CalendarioPage />} />
          <Route path="configuracion" element={<ConfigPage />} />
        </Route>

        <Route
          path="/edit-profile"
          element={
            <PrivateRoute>
              <EditProfile />
            </PrivateRoute>
          }
        />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
