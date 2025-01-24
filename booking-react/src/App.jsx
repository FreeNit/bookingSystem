import { BrowserRouter, Route, Routes } from "react-router-dom";

import Layout from "./pages/Layout";
import Homepage from "./pages/Homepage";
import Booking from "./pages/Booking";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import PageNotFound from "./pages/PageNotFound";
import Adminpage from "./pages/Adminpage";
import { useState } from "react";

function App() {
  const [user, setUser] = useState();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout user={user} setUser={setUser} />}>
          <Route index element={<Homepage user={user} />} />
          <Route path="/booking" element={<Booking user={user} />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Login setUser={setUser} />} />
          <Route path="/admin" element={<Adminpage user={user} />} />
          <Route path="*" element={<PageNotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
