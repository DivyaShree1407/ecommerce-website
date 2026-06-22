// components/ProtectedRoute.jsx
const ProtectedRoute = ({ children, adminOnly }) => {
  const { user, token } = useSelector(state => state.auth);
  if (!token) return <Navigate to="/login" />;
  if (adminOnly && user.role !== 'admin') return <Navigate to="/" />;
  return children;
};
<Route path="/admin/products" element={
  <ProtectedRoute adminOnly><AdminProducts /></ProtectedRoute>
} />