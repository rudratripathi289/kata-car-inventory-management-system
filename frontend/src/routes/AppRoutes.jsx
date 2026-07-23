import { Routes, Route } from 'react-router-dom'

/**
 * AppRoutes – Central route configuration.
 *
 * Add page routes here as development progresses.
 * Example:
 *   <Route path="/" element={<HomePage />} />
 *   <Route path="/vehicles" element={<VehiclesPage />} />
 *   <Route path="/vehicles/:id" element={<VehicleDetailPage />} />
 *   <Route path="/login" element={<LoginPage />} />
 *   <Route path="/register" element={<RegisterPage />} />
 *   <Route path="/admin/*" element={<AdminRoutes />} />
 */
function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<div>App is running</div>} />
    </Routes>
  )
}

export default AppRoutes
