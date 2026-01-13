// import { useState } from 'react'

// import './App.css'
// import { BrowserRouter, Route, Routes } from 'react-router-dom'
// import Login from './pages/Login'
// import Register from './pages/Register'
// import Dashboard from './pages/Dashboard'
// import ProtectedRoute from './components/ProtectedRoute'

// function App() {
  

//   return (
// <>
//     <BrowserRouter>
//     <Routes>
//       <Route path='/' element ={<Login/>}/>
//       <Route path='/register' element = {<Register/>}/>
//          <Route element={<ProtectedRoute />}>
//           <Route path="/dashboard" element={<Dashboard />} />
//         </Route>

     
//     </Routes>
//     </BrowserRouter>
// </>
//   )
// }

// export default App


import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './App.css'
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';

// Create router
const router = createBrowserRouter([
  {
    path: '/',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: '/dashboard/*',
        element: <Dashboard />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;