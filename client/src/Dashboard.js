import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaList, FaTrash, FaEdit,FaSearch, FaUserPlus, FaTh, FaSave, FaTimes, FaMapMarkerAlt, FaMapPin, FaPhone, FaEnvelope, FaBuilding, FaIdCard, FaCopy, FaUserCircle, FaHome, FaGlobe, FaSpinner } from 'react-icons/fa';

// ======================
// Reusable Components
// ======================

const UserCard = ({ user, onEdit, onDelete, onView, hoveredCardId, setHoveredCardId, focusedInputId, setFocusedInputId }) => {
  return (
    <div
      key={user._id}
      style={{
        ...styles.userCard,
        transform: hoveredCardId === user._id ? 'translateY(-5px)' : 'none',
        boxShadow: hoveredCardId === user._id ? '0 12px 30px rgba(0,0,0,0.15)' : '0 6px 16px rgba(0,0,0,0.1)',
        cursor: 'pointer',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
      onMouseEnter={() => setHoveredCardId(user._id)}
      onMouseLeave={() => setHoveredCardId(null)}
      onClick={() => onView(user)}
    >
      {/* User ID Badge */}
      <div style={styles.userIdContainer}>
        <FaIdCard style={styles.idIcon} />
        <span style={styles.idKey}>ID:</span>
        <span style={styles.userId}>{user._id}</span>
      </div>
      {/* Name */}
      <h3 style={styles.userName}>{user.name}</h3>
      {/* Info Grid */}
      <div style={styles.userInfo}>
        <div style={styles.infoItem}>
          <FaEnvelope style={styles.infoIcon} />
          <span style={styles.infoText}>{user.email}</span>
        </div>
        <div style={styles.infoItem}>
          <FaPhone style={styles.infoIcon} />
          <span style={styles.infoText}>{user.phone || 'N/A'}</span>
        </div>
        <div style={styles.infoItem}>
          <FaBuilding style={styles.infoIcon} />
          <span style={styles.infoText}>{user.company || 'N/A'}</span>
        </div>
      </div>
      {/* Action Buttons */}
      <div style={styles.buttonGroup}>
        <button
          onClick={(e) => { e.stopPropagation(); onEdit(user); }}
          style={{
            ...styles.editButton,
            backgroundColor: hoveredCardId === user._id ? '#d35400' : '#f39c12',
          }}
        >
          <FaEdit /> Edit
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(user._id); }}
          style={{
            ...styles.deleteButton,
            backgroundColor: hoveredCardId === user._id ? '#c0392b' : '#e74c3c',
          }}
        >
          <FaTrash /> Delete
        </button>
      </div>
    </div>
  );
};

const UserTable = ({ users, onEdit, onDelete, onView, hoveredCardId, setHoveredCardId, focusedInputId, setFocusedInputId }) => {
  return (
    <div style={styles.tableContainer}>
      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.tableHeader}>
              <th style={styles.tableHeaderTh}>Name</th>
              <th style={styles.tableHeaderTh}>Email</th>
              <th style={styles.tableHeaderTh}>Phone</th>
              <th style={styles.tableHeaderTh}>Company</th>
              <th style={styles.tableHeaderTh}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map(user => (
                <tr
                  key={user._id}
                  style={{
                    ...styles.tableRow,
                    backgroundColor: hoveredCardId === user._id ? '#f8f9fa' : 'white',
                    transition: 'background-color 0.2s ease',
                  }}
                  onMouseEnter={() => setHoveredCardId(user._id)}
                  onMouseLeave={() => setHoveredCardId(null)}
                  onClick={() => onView(user)}
                >
                  <td style={styles.tableHeaderTd}>{user.name}</td>
                  <td style={styles.tableHeaderTd}>{user.email}</td>
                  <td style={styles.tableHeaderTd}>{user.phone || 'N/A'}</td>
                  <td style={styles.tableHeaderTd}>{user.company || 'N/A'}</td>
                  <td style={styles.tableActions}>
                    <button
                      onClick={(e) => { e.stopPropagation(); onEdit(user); }}
                      style={styles.tableEditButton}
                      aria-label="Edit user"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); onDelete(user._id); }}
                      style={styles.tableDeleteButton}
                      aria-label="Delete user"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '20px', color: '#7f8c8d' }}>
                  No users found matching the search term.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const UserDetailModal = ({ user, onClose }) => {
  if (!user) return null;

  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div
        style={styles.userDetailModal}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={styles.modalHeader}>
          
          <h2 style={styles.modalTitle}><FaUserCircle /> User Details</h2>
          <button onClick={onClose} style={styles.closeButton}>
            <FaTimes />
          </button>
        </div>
       <div style={styles.detailSection}>
  <h3 style={styles.sectionTitle}>
    <FaIdCard /> User ID
  </h3>
  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
    <p style={styles.fullIdText}>{user._id}</p>
    <FaCopy
      style={{ cursor: "pointer", color: "#007bff" }}
      onClick={() => navigator.clipboard.writeText(user._id)}
    />
  </div>
</div>

 <div style={styles.userDetailContent}>
  {/* Basic Info */}
  <div style={styles.detailSection}>
    <h3 style={styles.sectionTitle}><FaIdCard /> User Information</h3>
    
    <div style={styles.rowGroup}>
      <div style={styles.detailRow}>
        <span style={styles.detailLabel}>Name:</span>
        <span style={styles.detailText}>{user.name}</span>
      </div>
      <div style={styles.detailRow}>
        <span style={styles.detailLabel}>Email:</span>
        <span style={styles.detailText}>{user.email}</span>
      </div>
    </div>

    <div style={styles.rowGroup}>
      <div style={styles.detailRow}>
        <span style={styles.detailLabel}>Phone:</span>
        <span style={styles.detailText}>{user.phone || 'N/A'}</span>
      </div>
      <div style={styles.detailRow}>
        <span style={styles.detailLabel}>Company:</span>
        <span style={styles.detailText}>{user.company || 'N/A'}</span>
      </div>
    </div>
  </div>

  {/* Address */}
  <div style={styles.detailSection}>
    <h3 style={styles.sectionTitle}><FaHome /> Address</h3>
    
    <div style={styles.rowGroup}>
      <div style={styles.detailRow}>
        <span style={styles.detailLabel}>Street:</span>
        <span style={styles.detailText}>{user.address?.street || 'N/A'}</span>
      </div>
      <div style={styles.detailRow}>
        <span style={styles.detailLabel}>City:</span>
        <span style={styles.detailText}>{user.address?.city || 'N/A'}</span>
      </div>
    </div>

    <div style={styles.rowGroup}>
      <div style={styles.detailRow}>
        <span style={styles.detailLabel}>ZIP Code:</span>
        <span style={styles.detailText}>{user.address?.zipcode || 'N/A'}</span>
      </div>
    </div>
  </div>

  {/* Geo */}
  <div style={styles.detailSection}>
    <h3 style={styles.sectionTitle}><FaMapPin /> Geographic Coordinates</h3>
    
    <div style={styles.rowGroup}>
      <div style={styles.detailRow}>
        <span style={styles.detailLabel}>Latitude:</span>
        <span style={styles.detailText}>{user.address?.geo?.lat || 'N/A'}</span>
      </div>
      <div style={styles.detailRow}>
        <span style={styles.detailLabel}>Longitude:</span>
        <span style={styles.detailText}>{user.address?.geo?.lng || 'N/A'}</span>
      </div>
    </div>
  </div>
</div>

      </div>
    </div>
  );
};

const EditUserModal = ({ user, onSave, onCancel, focusedInputId, setFocusedInputId }) => {
  const [editUser, setEditUser] = useState(user || {});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditUser(prev => ({ ...prev, [name]: value }));
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setEditUser(prev => ({
      ...prev,
      address: { ...prev.address, [name]: value }
    }));
  };

  const handleGeoChange = (e) => {
    const { name, value } = e.target;
    setEditUser(prev => ({
      ...prev,
      address: {
        ...prev.address,
        geo: { ...prev.address.geo, [name]: value }
      }
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(editUser);
  };

  return (
    <div style={styles.modalOverlay} onClick={onCancel}>
      <div
        style={styles.editModalContent}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={styles.modalHeader}>
          <h2 style={styles.modalTitle}><FaEdit /> Edit User</h2>
          <button onClick={onCancel} style={styles.closeButton}>
            <FaTimes />
          </button>
        </div>
        <form onSubmit={handleSubmit} style={styles.form}>
          {/* Personal Info */}
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}><FaUserPlus /> Personal Information</h3>
            <div style={styles.inputGroup}>
              <label>Name</label>
              <input
                type="text"
                name="name"
                value={editUser.name || ''}
                onChange={handleInputChange}
                onFocus={() => setFocusedInputId('name')}
                onBlur={() => setFocusedInputId(null)}
                style={{
                  ...styles.input,
                  borderColor: focusedInputId === 'name' ? '#3498db' : '#ddd',
                  boxShadow: focusedInputId === 'name' ? '0 0 0 2px rgba(52, 152, 219, 0.2)' : 'none',
                }}
                placeholder="Enter full name"
                required
              />
            </div>
            <div style={styles.inputGroup}>
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={editUser.email || ''}
                onChange={handleInputChange}
                onFocus={() => setFocusedInputId('email')}
                onBlur={() => setFocusedInputId(null)}
                style={{
                  ...styles.input,
                  borderColor: focusedInputId === 'email' ? '#3498db' : '#ddd',
                  boxShadow: focusedInputId === 'email' ? '0 0 0 2px rgba(52, 152, 219, 0.2)' : 'none',
                }}
                placeholder="Enter valid email"
                required
              />
            </div>
            <div style={styles.inputGroup}>
              <label>Phone</label>
              <input
                type="tel"
                name="phone"
                value={editUser.phone || ''}
                onChange={handleInputChange}
                onFocus={() => setFocusedInputId('phone')}
                onBlur={() => setFocusedInputId(null)}
                style={{
                  ...styles.input,
                  borderColor: focusedInputId === 'phone' ? '#3498db' : '#ddd',
                  boxShadow: focusedInputId === 'phone' ? '0 0 0 2px rgba(52, 152, 219, 0.2)' : 'none',
                }}
                placeholder="Enter phone number"
              />
            </div>
            <div style={styles.inputGroup}>
              <label>Company</label>
              <input
                type="text"
                name="company"
                value={editUser.company || ''}
                onChange={handleInputChange}
                onFocus={() => setFocusedInputId('company')}
                onBlur={() => setFocusedInputId(null)}
                style={{
                  ...styles.input,
                  borderColor: focusedInputId === 'company' ? '#3498db' : '#ddd',
                  boxShadow: focusedInputId === 'company' ? '0 0 0 2px rgba(52, 152, 219, 0.2)' : 'none',
                }}
                placeholder="Enter company name"
              />
            </div>
          </div>

          {/* Address */}
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}><FaHome /> Address</h3>
            <div style={styles.inputGroup}>
              <label>Street</label>
              <input
                type="text"
                name="street"
                value={editUser.address?.street || ''}
                onChange={handleAddressChange}
                onFocus={() => setFocusedInputId('street')}
                onBlur={() => setFocusedInputId(null)}
                style={{
                  ...styles.input,
                  borderColor: focusedInputId === 'street' ? '#3498db' : '#ddd',
                  boxShadow: focusedInputId === 'street' ? '0 0 0 2px rgba(52, 152, 219, 0.2)' : 'none',
                }}
                placeholder="Street address"
              />
            </div>
            <div style={styles.inputGroup}>
              <label>City</label>
              <input
                type="text"
                name="city"
                value={editUser.address?.city || ''}
                onChange={handleAddressChange}
                onFocus={() => setFocusedInputId('city')}
                onBlur={() => setFocusedInputId(null)}
                style={{
                  ...styles.input,
                  borderColor: focusedInputId === 'city' ? '#3498db' : '#ddd',
                  boxShadow: focusedInputId === 'city' ? '0 0 0 2px rgba(52, 152, 219, 0.2)' : 'none',
                }}
                placeholder="City"
              />
            </div>
            <div style={styles.inputGroup}>
              <label>ZIP Code</label>
              <input
                type="text"
                name="zipcode"
                value={editUser.address?.zipcode || ''}
                onChange={handleAddressChange}
                onFocus={() => setFocusedInputId('zipcode')}
                onBlur={() => setFocusedInputId(null)}
                style={{
                  ...styles.input,
                  borderColor: focusedInputId === 'zipcode' ? '#3498db' : '#ddd',
                  boxShadow: focusedInputId === 'zipcode' ? '0 0 0 2px rgba(52, 152, 219, 0.2)' : 'none',
                }}
                placeholder="ZIP/Postal code"
              />
            </div>
          </div>

          {/* Geo Coordinates */}
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}><FaMapPin /> Geographic Coordinates</h3>
            <div style={styles.inputGroup}>
              <label>Latitude</label>
              <input
                type="number"
                step="any"
                name="lat"
                value={editUser.address?.geo?.lat || ''}
                onChange={handleGeoChange}
                onFocus={() => setFocusedInputId('lat')}
                onBlur={() => setFocusedInputId(null)}
                style={{
                  ...styles.input,
                  borderColor: focusedInputId === 'lat' ? '#3498db' : '#ddd',
                  boxShadow: focusedInputId === 'lat' ? '0 0 0 2px rgba(52, 152, 219, 0.2)' : 'none',
                }}
                placeholder="e.g., 40.7128"
              />
            </div>
            <div style={styles.inputGroup}>
              <label>Longitude</label>
              <input
                type="number"
                step="any"
                name="lng"
                value={editUser.address?.geo?.lng || ''}
                onChange={handleGeoChange}
                onFocus={() => setFocusedInputId('lng')}
                onBlur={() => setFocusedInputId(null)}
                style={{
                  ...styles.input,
                  borderColor: focusedInputId === 'lng' ? '#3498db' : '#ddd',
                  boxShadow: focusedInputId === 'lng' ? '0 0 0 2px rgba(52, 152, 219, 0.2)' : 'none',
                }}
                placeholder="e.g., -74.0060"
              />
            </div>
          </div>

          {/* Actions */}
          <div style={styles.buttonRow}>
            <button
              type="submit"
              style={{
                ...styles.submitButton,
                backgroundColor: '#27ae60',
                boxShadow: '0 4px 12px rgba(39, 174, 96, 0.3)',
              }}
            >
              <FaSave /> Save Changes
            </button>
            <button
              type="button"
              onClick={onCancel}
              style={{
                ...styles.cancelButton,
                backgroundColor: '#95a5a6',
                boxShadow: '0 4px 12px rgba(149, 165, 166, 0.3)',
              }}
            >
              <FaTimes /> Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ======================
// Main Dashboard Component
// ======================

export default function Dashboard() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editUser, setEditUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [viewMode, setViewMode] = useState('cards');
  const [hoveredCardId, setHoveredCardId] = useState(null);
  const [hoveredButton, setHoveredButton] = useState(null);
  const [getById, setGetById] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserDetail, setShowUserDetail] = useState(false);
  const [focusedInputId, setFocusedInputId] = useState(null); // 👈 NEW STATE FOR FOCUS EFFECTS
  const navigate = useNavigate();
const [loading, setLoading] = useState(false); // 👈 Add this
  // Fetch all users on mount
  // useEffect(() => {
  //   fetchAllUsers();
  // }, []);

const fetchAllUsers = () => {
  setLoading(true); // 👈 Start loading
  axios.get('http://forty4technology.vercel.app/api/users')
    .then(res => {
setUsers(Array.isArray(res.data) ? res.data : res.data.users || []);

      alert('Users fetched successfully!');
    })
    .catch(err => {
      console.error('Error fetching users:', err);
      alert('Failed to fetch users. Check console for details.');
    })
    .finally(() => {
      setLoading(false); // 👈 Stop loading
    });
};

const fetchUserById = () => {
  if (!getById.trim()) return;
  setLoading(true);
  axios.get(`https://forty4technology.vercel.app/api/users/${getById}`)
    .then(res => {
      setUsers([res.data]); // 👈 Only show this one user
      alert('User fetched successfully!');
    })
    .catch(err => {
      console.error('Error fetching user:', err);
      if (err.response && err.response.data && err.response.data.error) {
        alert(err.response.data.error);
      } else {
        alert('Something went wrong. Please try again.');
      }
    })
    .finally(() => {
      setLoading(false);
    });
};


  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      axios.delete(`https://forty4technology.vercel.app/api/users/${id}`)
        .then(() => {
          setUsers(users.filter(user => user._id !== id));
          alert('User deleted successfully!');
        })
        .catch(err => {
          console.error('Error deleting user:', err);
          alert('Failed to delete user. Check console for details.');
        });
    }
  };

  const handleEdit = (user) => {
    setEditUser({ ...user });
    setShowEditModal(true);
  };

const handleSubmitEdit = (updatedUser) => {
  axios
    .put(`https://forty4technology.vercel.app/api/users/${updatedUser._id}`, updatedUser)
    .then((res) => {
      setUsers(users.map(user => user._id === res.data._id ? res.data : user));
      setShowEditModal(false);
      setEditUser(null);
      alert("User updated successfully!");
    })
    .catch((err) => {
      console.error("Error updating user:", err);
      alert("Failed to update user. Check console for details.");
    });
};


  const navigateToCreateUser = () => {
    navigate('/create-user');
  };

  const openUserDetail = (user) => {
    setSelectedUser(user);
    setShowUserDetail(true);
  };

  const closeUserDetail = () => {
    setShowUserDetail(false);
    setSelectedUser(null);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setEditUser(null);
    setFocusedInputId(null); // Clear focus when modal closes
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user._id.includes(searchTerm)
  );

  // ======================
  // Render
  // ======================

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>📊User Management Dashboard</h1>
        <div style={styles.headerActions}>
          <button
            onClick={() => setViewMode(viewMode === 'cards' ? 'table' : 'cards')}
            style={{
              ...styles.viewToggle,
              backgroundColor: hoveredButton === 'view' ? '#2980b9' : '#3498db',
            }}
            onMouseEnter={() => setHoveredButton('view')}
            onMouseLeave={() => setHoveredButton(null)}
            aria-label={`Switch to ${viewMode === 'cards' ? 'table' : 'card'} view`}
          >
            {viewMode === 'cards' ? <FaList /> : <FaTh />}
            {viewMode === 'cards' ? 'Table View' : 'Card View'}
          </button>
          <button
            onClick={navigateToCreateUser}
            style={{
              ...styles.createButton,
              backgroundColor: hoveredButton === 'create' ? '#27ae60' : '#2ecc71',
            }}
            onMouseEnter={() => setHoveredButton('create')}
            onMouseLeave={() => setHoveredButton(null)}
            aria-label="Create new user"
          >
            <FaUserPlus /> Create User
          </button>
        </div>
      </header>

      <div style={styles.fetchContainer}>
       <button
  onClick={fetchAllUsers}
  disabled={loading}
  style={{
    ...styles.fetchButton,
    backgroundColor: hoveredButton === 'getAll' ? '#2980b9' : '#3498db',
    opacity: loading ? 0.7 : 1,
    cursor: loading ? 'not-allowed' : 'pointer',
  }}
  onMouseEnter={() => setHoveredButton('getAll')}
  onMouseLeave={() => setHoveredButton(null)}
  aria-label="Fetch all users"
>
  {loading ? (
    <>
      <FaSpinner className="fa-spin" /> Loading...
    </>
  ) : (
    <>
      <FaList /> Get All Users
    </>
  )}
</button>
        <div style={styles.getByIdContainer}>
          <input
            type="text"
            placeholder="Enter User ID (e.g., 68c448c1d5fa9e28e4f3bae5)"
            value={getById}
            onChange={(e) => setGetById(e.target.value)}
            style={{
              ...styles.getByIdInput,
              borderColor: focusedInputId === 'getById' ? '#3498db' : '#ddd',
              boxShadow: focusedInputId === 'getById' ? '0 0 0 2px rgba(52, 152, 219, 0.2)' : 'none',
            }}
            onFocus={() => setFocusedInputId('getById')}
            onBlur={() => setFocusedInputId(null)}
            aria-label="Enter user ID to fetch"
          />
          <button
            onClick={fetchUserById}
            style={{
              ...styles.fetchButton,
              backgroundColor: hoveredButton === 'getById' ? '#27ae60' : '#2ecc71',
            }}
            onMouseEnter={() => setHoveredButton('getById')}
            onMouseLeave={() => setHoveredButton(null)}
            aria-label="Fetch user by ID"
          >
            <FaSearch /> Get User by ID
          </button>
        </div>
      </div>

      <div style={styles.searchContainer}>
        <FaSearch style={styles.searchIcon} />
        <input
          type="text"
          placeholder="Search by name, email, or ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            ...styles.searchInput,
            borderColor: focusedInputId === 'search' ? '#3498db' : '#e0e0e0',
            boxShadow: focusedInputId === 'search' ? '0 0 0 2px rgba(52, 152, 219, 0.2)' : 'none',
          }}
          onFocus={() => setFocusedInputId('search')}
          onBlur={() => setFocusedInputId(null)}
          aria-label="Search users"
        />
      </div>

      {users.length === 0 ? (
        <div style={styles.emptyState}>
          <p>No users loaded. Click "Get All Users" or search by ID.</p>
        </div>
      ) : viewMode === 'cards' ? (
        <div style={styles.userList}>
          {filteredUsers.length > 0 ? (
            filteredUsers.map(user => (
              <UserCard
                key={user._id}
                user={user}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onView={openUserDetail}
                hoveredCardId={hoveredCardId}
                setHoveredCardId={setHoveredCardId}
                focusedInputId={focusedInputId}
                setFocusedInputId={setFocusedInputId}
              />
            ))
          ) : (
            <p style={styles.noResults}>No users found matching "{searchTerm}".</p>
          )}
        </div>
      ) : (
        <UserTable
          users={filteredUsers}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onView={openUserDetail}
          hoveredCardId={hoveredCardId}
          setHoveredCardId={setHoveredCardId}
          focusedInputId={focusedInputId}
          setFocusedInputId={setFocusedInputId}
        />
      )}

      {showUserDetail && (
        <UserDetailModal
          user={selectedUser}
          onClose={closeUserDetail}
        />
      )}

      {showEditModal && (
        <EditUserModal
          user={editUser}
          onSave={handleSubmitEdit}
          onCancel={closeEditModal}
          focusedInputId={focusedInputId}
          setFocusedInputId={setFocusedInputId}
        />
      )}
    </div>
  );
}

// ======================
// STYLES (Optimized & Modernized) — ALL INLINE, NO EXTERNAL CSS
// ======================

const styles = {
    container: {
    maxWidth: '1900px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: "'Segoe UI', 'Roboto', 'Helvetica Neue', sans-serif",
    backgroundColor: '#f5f7fa',

    // 👇 force container scrolling
  
    overflowY: 'auto',
    overflowX: 'hidden',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
    flexWrap: 'wrap',
    gap: '15px',
    padding: '0 10px',
  },
  title: {
    color: '#2c3e50',
    fontSize: '2.2em',
    fontWeight: '600',
    margin: 0,
    fontFamily: "'Montserrat', sans-serif",
    textShadow: '1px 1px 3px rgba(0,0,0,0.1)',
  },
  headerActions: {
    display: 'flex',
    gap: '15px',
    flexWrap: 'wrap',
  },
  viewToggle: {
    padding: '10px 16px',
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '0.9em',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    transition: 'background-color 0.3s ease, transform 0.2s',
    boxShadow: '0 3px 8px rgba(0,0,0,0.1)',
  },
  createButton: {
    padding: '10px 16px',
    backgroundColor: '#2ecc71',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '0.9em',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    transition: 'background-color 0.3s ease, transform 0.2s',
    boxShadow: '0 3px 8px rgba(0,0,0,0.1)',
  },
  fetchContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '20px',
    marginBottom: '30px',
    alignItems: 'center',
    flexWrap: 'wrap',
    padding: '0 10px',
  },
  fetchButton: {
    padding: '12px 24px',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '1em',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'background-color 0.3s ease, transform 0.2s',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  },
  getByIdContainer: {
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
    flexWrap: 'nowrap',
  },
  getByIdInput: {
    padding: '12px',
    borderRadius: '6px',
    border: '1px solid #ddd',
    fontSize: '0.9em',
    width: '280px',
    outline: 'none',
    transition: 'border-color 0.3s, box-shadow 0.3s',
  },
  searchContainer: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '30px',
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '8px 15px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    maxWidth: '500px',
    margin: '0 auto',
    marginBottom:'14px',marginBottom:'20px',
    border: '1px solid #e0e0e0',
  },
  searchIcon: {
    color: '#7f8c8d',
    fontSize: '1.2em',
    padding: '10px',
  },
  searchInput: {
    flex: 1,
    border: '1px solid #e0e0e0',
    outline: 'none',
    padding: '10px',
    fontSize: '0.9em',
    borderRadius: '5px',
    color: '#2c3e50',
    transition: 'border-color 0.3s, box-shadow 0.3s',
  },
  emptyState: {
    textAlign: 'center',
    color: '#7f8c8d',
    fontSize: '1.2em',
    padding: '40px',
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 6px 16px rgba(0,0,0,0.1)',
    marginBottom: '40px',
    fontStyle: 'italic',
  },
  userList: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '20px',
    marginBottom: '40px',
    padding: '0 10px',
  },
  userCard: {
    backgroundColor: 'white',
    borderRadius: '16px',
    padding: '20px',
    boxShadow: '0 6px 16px rgba(0,0,0,0.1)',
    transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s',
    position: 'relative',
    overflow: 'hidden',
    cursor: 'pointer',
    borderLeft: '4px solid #3498db',
  },
  userIdContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '16px',
    padding: '8px',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
  },
  idIcon: {
    color: '#e74c3c',
    fontSize: '1.3em',
  },
  idKey: {
    color: '#e74c3c',
    fontWeight: 'bold',
    fontSize: '0.9em',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  userId: {
    backgroundColor: '#fadbd8',
    color: '#c0392b',
    padding: '6px 14px',
    borderRadius: '20px',
    fontSize: '0.85em',
    fontWeight: 'bold',
    wordBreak: 'break-all',
    fontFamily: 'monospace',
  },
  userName: {
    margin: '0 0 16px 0',
    color: '#2c3e50',
    fontSize: '1.6em',
    fontWeight: '700',
    fontFamily: "'Montserrat', sans-serif",
    textAlign: 'center',
    textShadow: '1px 1px 2px rgba(0,0,0,0.05)',
  },
  userInfo: {
    margin: '16px 0',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  infoItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    backgroundColor: '#e8f4fd',
    padding: '10px 14px',
    borderRadius: '8px',
    fontSize: '0.9em',
    borderLeft: '3px solid #3498db',
  },
  infoIcon: {
    color: '#3498db',
    fontSize: '1.1em',
  },
  infoText: {
    color: '#2c3e50',
    fontWeight: '500',
  },
  buttonGroup: {
    display: 'flex',
    gap: '10px',
    marginTop: '20px',
    justifyContent: 'center',
  },
  editButton: {
    padding: '8px 16px',
    backgroundColor: '#f39c12',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '0.9em',
    fontWeight: '600',
    transition: 'background-color 0.3s, transform 0.2s',
    boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
  },
  deleteButton: {
    padding: '8px 16px',
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '0.9em',
    fontWeight: '600',
    transition: 'background-color 0.3s, transform 0.2s',
    boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
  },
  noResults: {
    textAlign: 'center',
    color: '#7f8c8d',
    fontSize: '1.1em',
    gridColumn: '1 / -1',
    padding: '40px',
    fontStyle: 'italic',
  },
  tableContainer: {
    backgroundColor: 'white',
    borderRadius: '16px',
    boxShadow: '0 6px 16px rgba(0,0,0,0.1)',
    overflow: 'hidden',
    marginBottom: '40px',
    margin: '0 10px',
  },
  tableWrapper: {
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '0.9em',
    minWidth: '800px',
  },
  tableHeader: {
    backgroundColor: '#3498db',
    color: 'white',
    textAlign: 'left',
  },
  tableHeaderTh: {
    padding: '16px',
    fontWeight: '600',
    fontFamily: "'Montserrat', sans-serif",
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    fontSize: '0.9em',
  },
  tableRow: {
    borderBottom: '1px solid #eee',
    transition: 'background-color 0.2s ease',
    cursor: 'pointer',
    height: '56px',
  },
  tableHeaderTd: {
    padding: '12px 16px',
    verticalAlign: 'top',
    fontSize: '0.85em',
    color: '#2c3e50',
  },
  tableActions: {
    display: 'flex',
    gap: '8px',
    justifyContent: 'center',
  },
  tableEditButton: {
    padding: '6px 10px',
    backgroundColor: '#f39c12',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.85em',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '36px',
    transition: 'background-color 0.2s',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  tableDeleteButton: {
    padding: '6px 10px',
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.85em',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '36px',
    transition: 'background-color 0.2s',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.6)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    padding: '20px',
    backdropFilter: 'blur(5px)',
  },
  userDetailModal: {
    backgroundColor: 'white',
    borderRadius: '20px',
    width: '100%',
    maxWidth: '900px',
    maxHeight: '80vh',
    overflowY: 'auto',
    boxShadow: '0 30px 60px rgba(0,0,0,0.3)',
    position: 'relative',
    padding: '30px',
    animation: 'slideUp 0.4s ease-out',
  },
  editModalContent: {
    backgroundColor: 'white',
    borderRadius: '20px',
    width: '100%',
    maxWidth: '720px',
    maxHeight: '90vh',
    overflowY: 'auto',
    boxShadow: '0 30px 60px rgba(0,0,0,0.3)',
    position: 'relative',
    padding: '30px',
    animation: 'slideUp 0.4s ease-out',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 0 24px',
    borderBottom: '1px solid #eee',
    marginBottom: '24px',
  },
  modalTitle: {
    margin: 0,
    color: '#2c3e50',
    fontSize: '1.8em',
    fontWeight: '700',
    fontFamily: "'Montserrat', sans-serif",
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  closeButton: {
    background: 'none',
    border: 'none',
    fontSize: '1.8em',
    cursor: 'pointer',
    color: '#7f8c8d',
    padding: '8px',
    borderRadius: '50%',
    transition: 'background-color 0.3s, color 0.3s',
    backgroundColor: 'transparent',
  },
  userDetailContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  detailSection: {
    backgroundColor: '#f5f9faff',
    padding: '20px',
    fontWeight:'bold',
    borderRadius: '12px',
    borderLeft: '4px solid #063629ff',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
  },
  sectionTitle: {
    margin: '0 0 16px 0',
    color: '#14422eff',
    fontSize: '1.3em',
    fontWeight: '600',
    fontFamily: "'Montserrat', sans-serif",
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    textTransform: 'capitalize',
  },
  detailRow: {
    display: 'flex',
    marginBottom: '6px',
    alignItems: 'center',
    gap: '12px',
  },
  detailLabel: {
    fontWeight: '600',
    color: '#7f8c8d',
    minWidth: '140px',
    flexShrink: 0,
  },
  detailText: {
    color: '#2c3e50',
    fontSize: '0.95em',
    lineHeight: '1.5',
  },
  fullIdText: {
    color: '#130017ff',
    fontFamily: 'monospace',
    fontSize: '0.9em',
    padding: '12px',
    backgroundColor: '#fff0f0',
    borderRadius: '8px',
    wordBreak: 'break-all',
    borderLeft: '3px solid #e74c3c',
  },rowGroup: {
  display: 'flex',
  justifyContent: 'space-between',
  gap: '20px',
  marginBottom: '12px',
},
detailRow: {
  flex: 1, // allow equal width
  display: 'flex',
  gap: '8px',
},

  form: {
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  section: {
    backgroundColor: '#fafafa',
    padding: '20px',
    borderRadius: '12px',
    borderLeft: '4px solid #3498db',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
  },
  inputGroup: {
    marginBottom: '18px',
  },
  input: {
    width: '100%',
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    fontSize: '0.9em',
    boxSizing: 'border-box',
    transition: 'border-color 0.3s, box-shadow 0.3s',
    outline: 'none',
  },
  buttonRow: {
    display: 'flex',
    gap: '15px',
    justifyContent: 'flex-end',
    marginTop: '24px',
    padding: '16px 0',
    borderTop: '1px solid #eee',
  },
  submitButton: {
    padding: '12px 24px',
    backgroundColor: '#2ecc71',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    fontSize: '1em',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'background-color 0.3s, transform 0.2s',
    boxShadow: '0 4px 14px rgba(46, 204, 113, 0.3)',
  },
  cancelButton: {
    padding: '12px 24px',
    backgroundColor: '#95a5a6',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    fontSize: '1em',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'background-color 0.3s, transform 0.2s',
    boxShadow: '0 4px 14px rgba(149, 165, 166, 0.3)',
  },
};

// Add global animations
const globalStyles = document.createElement('style');
globalStyles.textContent = `
  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;
document.head.appendChild(globalStyles);

// Ensure responsive behavior on mobile
if (typeof window !== 'undefined') {
  const resizeHandler = () => {
    const root = document.documentElement;
    const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
    root.style.setProperty('--vw', `${vw}px`);
  };
  window.addEventListener('resize', resizeHandler);
  resizeHandler();
}

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import { FaList, FaTrash, FaEdit,FaSearch, FaUserPlus, FaTh, FaSave, FaTimes, FaMapMarkerAlt, FaMapPin, FaPhone, FaEnvelope, FaBuilding, FaIdCard, FaCopy, FaUserCircle, FaHome, FaGlobe, FaSpinner } from 'react-icons/fa';

// // ======================
// // Reusable Components
// // ======================

// const UserCard = ({ user, onEdit, onDelete, onView, hoveredCardId, setHoveredCardId, focusedInputId, setFocusedInputId }) => {
//   return (
//     <div
//       key={user._id}
//       style={{
//         ...styles.userCard,
//         transform: hoveredCardId === user._id ? 'translateY(-5px)' : 'none',
//         boxShadow: hoveredCardId === user._id ? '0 12px 30px rgba(0,0,0,0.15)' : '0 6px 16px rgba(0,0,0,0.1)',
//         cursor: 'pointer',
//         transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
//       }}
//       onMouseEnter={() => setHoveredCardId(user._id)}
//       onMouseLeave={() => setHoveredCardId(null)}
//       onClick={() => onView(user)}
//     >
//       {/* User ID Badge */}
//       <div style={styles.userIdContainer}>
//         <FaIdCard style={styles.idIcon} />
//         <span style={styles.idKey}>ID:</span>
//         <span style={styles.userId}>{user._id}</span>
//       </div>
//       {/* Name */}
//       <h3 style={styles.userName}>{user.name}</h3>
//       {/* Info Grid */}
//       <div style={styles.userInfo}>
//         <div style={styles.infoItem}>
//           <FaEnvelope style={styles.infoIcon} />
//           <span style={styles.infoText}>{user.email}</span>
//         </div>
//         <div style={styles.infoItem}>
//           <FaPhone style={styles.infoIcon} />
//           <span style={styles.infoText}>{user.phone || 'N/A'}</span>
//         </div>
//         <div style={styles.infoItem}>
//           <FaBuilding style={styles.infoIcon} />
//           <span style={styles.infoText}>{user.company || 'N/A'}</span>
//         </div>
//       </div>
//       {/* Action Buttons */}
//       <div style={styles.buttonGroup}>
//         <button
//           onClick={(e) => { e.stopPropagation(); onEdit(user); }}
//           style={{
//             ...styles.editButton,
//             backgroundColor: hoveredCardId === user._id ? '#d35400' : '#f39c12',
//           }}
//         >
//           <FaEdit /> Edit
//         </button>
//         <button
//           onClick={(e) => { e.stopPropagation(); onDelete(user._id); }}
//           style={{
//             ...styles.deleteButton,
//             backgroundColor: hoveredCardId === user._id ? '#c0392b' : '#e74c3c',
//           }}
//         >
//           <FaTrash /> Delete
//         </button>
//       </div>
//     </div>
//   );
// };

// const UserTable = ({ users, onEdit, onDelete, onView, hoveredCardId, setHoveredCardId, focusedInputId, setFocusedInputId }) => {
//   return (
//     <div style={styles.tableContainer}>
//       <div style={styles.tableWrapper}>
//         <table style={styles.table}>
//           <thead>
//             <tr style={styles.tableHeader}>
//               <th style={styles.tableHeaderTh}>Name</th>
//               <th style={styles.tableHeaderTh}>Email</th>
//               <th style={styles.tableHeaderTh}>Phone</th>
//               <th style={styles.tableHeaderTh}>Company</th>
//               <th style={styles.tableHeaderTh}>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {users.length > 0 ? (
//               users.map(user => (
//                 <tr
//                   key={user._id}
//                   style={{
//                     ...styles.tableRow,
//                     backgroundColor: hoveredCardId === user._id ? '#f8f9fa' : 'white',
//                     transition: 'background-color 0.2s ease',
//                   }}
//                   onMouseEnter={() => setHoveredCardId(user._id)}
//                   onMouseLeave={() => setHoveredCardId(null)}
//                   onClick={() => onView(user)}
//                 >
//                   <td style={styles.tableHeaderTd}>{user.name}</td>
//                   <td style={styles.tableHeaderTd}>{user.email}</td>
//                   <td style={styles.tableHeaderTd}>{user.phone || 'N/A'}</td>
//                   <td style={styles.tableHeaderTd}>{user.company || 'N/A'}</td>
//                   <td style={styles.tableActions}>
//                     <button
//                       onClick={(e) => { e.stopPropagation(); onEdit(user); }}
//                       style={styles.tableEditButton}
//                       aria-label="Edit user"
//                     >
//                       <FaEdit />
//                     </button>
//                     <button
//                       onClick={(e) => { e.stopPropagation(); onDelete(user._id); }}
//                       style={styles.tableDeleteButton}
//                       aria-label="Delete user"
//                     >
//                       <FaTrash />
//                     </button>
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan="5" style={{ textAlign: 'center', padding: '20px', color: '#7f8c8d' }}>
//                   No users found matching the search term.
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// const UserDetailModal = ({ user, onClose }) => {
//   if (!user) return null;

//   return (
//     <div style={styles.modalOverlay} onClick={onClose}>
//       <div
//         style={styles.userDetailModal}
//         onClick={(e) => e.stopPropagation()}
//       >
//         <div style={styles.modalHeader}>
          
//           <h2 style={styles.modalTitle}><FaUserCircle /> User Details</h2>
//           <button onClick={onClose} style={styles.closeButton}>
//             <FaTimes />
//           </button>
//         </div>
//        <div style={styles.detailSection}>
//   <h3 style={styles.sectionTitle}>
//     <FaIdCard /> User ID
//   </h3>
//   <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
//     <p style={styles.fullIdText}>{user._id}</p>
//     <FaCopy
//       style={{ cursor: "pointer", color: "#007bff" }}
//       onClick={() => navigator.clipboard.writeText(user._id)}
//     />
//   </div>
// </div>

//  <div style={styles.userDetailContent}>
//   {/* Basic Info */}
//   <div style={styles.detailSection}>
//     <h3 style={styles.sectionTitle}><FaIdCard /> User Information</h3>
    
//     <div style={styles.rowGroup}>
//       <div style={styles.detailRow}>
//         <span style={styles.detailLabel}>Name:</span>
//         <span style={styles.detailText}>{user.name}</span>
//       </div>
//       <div style={styles.detailRow}>
//         <span style={styles.detailLabel}>Email:</span>
//         <span style={styles.detailText}>{user.email}</span>
//       </div>
//     </div>

//     <div style={styles.rowGroup}>
//       <div style={styles.detailRow}>
//         <span style={styles.detailLabel}>Phone:</span>
//         <span style={styles.detailText}>{user.phone || 'N/A'}</span>
//       </div>
//       <div style={styles.detailRow}>
//         <span style={styles.detailLabel}>Company:</span>
//         <span style={styles.detailText}>{user.company || 'N/A'}</span>
//       </div>
//     </div>
//   </div>

//   {/* Address */}
//   <div style={styles.detailSection}>
//     <h3 style={styles.sectionTitle}><FaHome /> Address</h3>
    
//     <div style={styles.rowGroup}>
//       <div style={styles.detailRow}>
//         <span style={styles.detailLabel}>Street:</span>
//         <span style={styles.detailText}>{user.address?.street || 'N/A'}</span>
//       </div>
//       <div style={styles.detailRow}>
//         <span style={styles.detailLabel}>City:</span>
//         <span style={styles.detailText}>{user.address?.city || 'N/A'}</span>
//       </div>
//     </div>

//     <div style={styles.rowGroup}>
//       <div style={styles.detailRow}>
//         <span style={styles.detailLabel}>ZIP Code:</span>
//         <span style={styles.detailText}>{user.address?.zipcode || 'N/A'}</span>
//       </div>
//     </div>
//   </div>

//   {/* Geo */}
//   <div style={styles.detailSection}>
//     <h3 style={styles.sectionTitle}><FaMapPin /> Geographic Coordinates</h3>
    
//     <div style={styles.rowGroup}>
//       <div style={styles.detailRow}>
//         <span style={styles.detailLabel}>Latitude:</span>
//         <span style={styles.detailText}>{user.address?.geo?.lat || 'N/A'}</span>
//       </div>
//       <div style={styles.detailRow}>
//         <span style={styles.detailLabel}>Longitude:</span>
//         <span style={styles.detailText}>{user.address?.geo?.lng || 'N/A'}</span>
//       </div>
//     </div>
//   </div>
// </div>

//       </div>
//     </div>
//   );
// };

// const EditUserModal = ({ user, onSave, onCancel, focusedInputId, setFocusedInputId }) => {
//   const [editUser, setEditUser] = useState(user || {});

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setEditUser(prev => ({ ...prev, [name]: value }));
//   };

//   const handleAddressChange = (e) => {
//     const { name, value } = e.target;
//     setEditUser(prev => ({
//       ...prev,
//       address: { ...prev.address, [name]: value }
//     }));
//   };

//   const handleGeoChange = (e) => {
//     const { name, value } = e.target;
//     setEditUser(prev => ({
//       ...prev,
//       address: {
//         ...prev.address,
//         geo: { ...prev.address.geo, [name]: value }
//       }
//     }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     onSave(editUser);
//   };

//   return (
//     <div style={styles.modalOverlay} onClick={onCancel}>
//       <div
//         style={styles.editModalContent}
//         onClick={(e) => e.stopPropagation()}
//       >
//         <div style={styles.modalHeader}>
//           <h2 style={styles.modalTitle}><FaEdit /> Edit User</h2>
//           <button onClick={onCancel} style={styles.closeButton}>
//             <FaTimes />
//           </button>
//         </div>
//         <form onSubmit={handleSubmit} style={styles.form}>
//           {/* Personal Info */}
//           <div style={styles.section}>
//             <h3 style={styles.sectionTitle}><FaUserPlus /> Personal Information</h3>
//             <div style={styles.inputGroup}>
//               <label>Name</label>
//               <input
//                 type="text"
//                 name="name"
//                 value={editUser.name || ''}
//                 onChange={handleInputChange}
//                 onFocus={() => setFocusedInputId('name')}
//                 onBlur={() => setFocusedInputId(null)}
//                 style={{
//                   ...styles.input,
//                   borderColor: focusedInputId === 'name' ? '#3498db' : '#ddd',
//                   boxShadow: focusedInputId === 'name' ? '0 0 0 2px rgba(52, 152, 219, 0.2)' : 'none',
//                 }}
//                 placeholder="Enter full name"
//                 required
//               />
//             </div>
//             <div style={styles.inputGroup}>
//               <label>Email</label>
//               <input
//                 type="email"
//                 name="email"
//                 value={editUser.email || ''}
//                 onChange={handleInputChange}
//                 onFocus={() => setFocusedInputId('email')}
//                 onBlur={() => setFocusedInputId(null)}
//                 style={{
//                   ...styles.input,
//                   borderColor: focusedInputId === 'email' ? '#3498db' : '#ddd',
//                   boxShadow: focusedInputId === 'email' ? '0 0 0 2px rgba(52, 152, 219, 0.2)' : 'none',
//                 }}
//                 placeholder="Enter valid email"
//                 required
//               />
//             </div>
//             <div style={styles.inputGroup}>
//               <label>Phone</label>
//               <input
//                 type="tel"
//                 name="phone"
//                 value={editUser.phone || ''}
//                 onChange={handleInputChange}
//                 onFocus={() => setFocusedInputId('phone')}
//                 onBlur={() => setFocusedInputId(null)}
//                 style={{
//                   ...styles.input,
//                   borderColor: focusedInputId === 'phone' ? '#3498db' : '#ddd',
//                   boxShadow: focusedInputId === 'phone' ? '0 0 0 2px rgba(52, 152, 219, 0.2)' : 'none',
//                 }}
//                 placeholder="Enter phone number"
//               />
//             </div>
//             <div style={styles.inputGroup}>
//               <label>Company</label>
//               <input
//                 type="text"
//                 name="company"
//                 value={editUser.company || ''}
//                 onChange={handleInputChange}
//                 onFocus={() => setFocusedInputId('company')}
//                 onBlur={() => setFocusedInputId(null)}
//                 style={{
//                   ...styles.input,
//                   borderColor: focusedInputId === 'company' ? '#3498db' : '#ddd',
//                   boxShadow: focusedInputId === 'company' ? '0 0 0 2px rgba(52, 152, 219, 0.2)' : 'none',
//                 }}
//                 placeholder="Enter company name"
//               />
//             </div>
//           </div>

//           {/* Address */}
//           <div style={styles.section}>
//             <h3 style={styles.sectionTitle}><FaHome /> Address</h3>
//             <div style={styles.inputGroup}>
//               <label>Street</label>
//               <input
//                 type="text"
//                 name="street"
//                 value={editUser.address?.street || ''}
//                 onChange={handleAddressChange}
//                 onFocus={() => setFocusedInputId('street')}
//                 onBlur={() => setFocusedInputId(null)}
//                 style={{
//                   ...styles.input,
//                   borderColor: focusedInputId === 'street' ? '#3498db' : '#ddd',
//                   boxShadow: focusedInputId === 'street' ? '0 0 0 2px rgba(52, 152, 219, 0.2)' : 'none',
//                 }}
//                 placeholder="Street address"
//               />
//             </div>
//             <div style={styles.inputGroup}>
//               <label>City</label>
//               <input
//                 type="text"
//                 name="city"
//                 value={editUser.address?.city || ''}
//                 onChange={handleAddressChange}
//                 onFocus={() => setFocusedInputId('city')}
//                 onBlur={() => setFocusedInputId(null)}
//                 style={{
//                   ...styles.input,
//                   borderColor: focusedInputId === 'city' ? '#3498db' : '#ddd',
//                   boxShadow: focusedInputId === 'city' ? '0 0 0 2px rgba(52, 152, 219, 0.2)' : 'none',
//                 }}
//                 placeholder="City"
//               />
//             </div>
//             <div style={styles.inputGroup}>
//               <label>ZIP Code</label>
//               <input
//                 type="text"
//                 name="zipcode"
//                 value={editUser.address?.zipcode || ''}
//                 onChange={handleAddressChange}
//                 onFocus={() => setFocusedInputId('zipcode')}
//                 onBlur={() => setFocusedInputId(null)}
//                 style={{
//                   ...styles.input,
//                   borderColor: focusedInputId === 'zipcode' ? '#3498db' : '#ddd',
//                   boxShadow: focusedInputId === 'zipcode' ? '0 0 0 2px rgba(52, 152, 219, 0.2)' : 'none',
//                 }}
//                 placeholder="ZIP/Postal code"
//               />
//             </div>
//           </div>

//           {/* Geo Coordinates */}
//           <div style={styles.section}>
//             <h3 style={styles.sectionTitle}><FaMapPin /> Geographic Coordinates</h3>
//             <div style={styles.inputGroup}>
//               <label>Latitude</label>
//               <input
//                 type="number"
//                 step="any"
//                 name="lat"
//                 value={editUser.address?.geo?.lat || ''}
//                 onChange={handleGeoChange}
//                 onFocus={() => setFocusedInputId('lat')}
//                 onBlur={() => setFocusedInputId(null)}
//                 style={{
//                   ...styles.input,
//                   borderColor: focusedInputId === 'lat' ? '#3498db' : '#ddd',
//                   boxShadow: focusedInputId === 'lat' ? '0 0 0 2px rgba(52, 152, 219, 0.2)' : 'none',
//                 }}
//                 placeholder="e.g., 40.7128"
//               />
//             </div>
//             <div style={styles.inputGroup}>
//               <label>Longitude</label>
//               <input
//                 type="number"
//                 step="any"
//                 name="lng"
//                 value={editUser.address?.geo?.lng || ''}
//                 onChange={handleGeoChange}
//                 onFocus={() => setFocusedInputId('lng')}
//                 onBlur={() => setFocusedInputId(null)}
//                 style={{
//                   ...styles.input,
//                   borderColor: focusedInputId === 'lng' ? '#3498db' : '#ddd',
//                   boxShadow: focusedInputId === 'lng' ? '0 0 0 2px rgba(52, 152, 219, 0.2)' : 'none',
//                 }}
//                 placeholder="e.g., -74.0060"
//               />
//             </div>
//           </div>

//           {/* Actions */}
//           <div style={styles.buttonRow}>
//             <button
//               type="submit"
//               style={{
//                 ...styles.submitButton,
//                 backgroundColor: '#27ae60',
//                 boxShadow: '0 4px 12px rgba(39, 174, 96, 0.3)',
//               }}
//             >
//               <FaSave /> Save Changes
//             </button>
//             <button
//               type="button"
//               onClick={onCancel}
//               style={{
//                 ...styles.cancelButton,
//                 backgroundColor: '#95a5a6',
//                 boxShadow: '0 4px 12px rgba(149, 165, 166, 0.3)',
//               }}
//             >
//               <FaTimes /> Cancel
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// // ======================
// // Main Dashboard Component
// // ======================

// export default function Dashboard() {
//   const [users, setUsers] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [editUser, setEditUser] = useState(null);
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [viewMode, setViewMode] = useState('cards');
//   const [hoveredCardId, setHoveredCardId] = useState(null);
//   const [hoveredButton, setHoveredButton] = useState(null);
//   const [getById, setGetById] = useState('');
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [showUserDetail, setShowUserDetail] = useState(false);
//   const [focusedInputId, setFocusedInputId] = useState(null); // 👈 NEW STATE FOR FOCUS EFFECTS
//   const navigate = useNavigate();
// const [loading, setLoading] = useState(false); // 👈 Add this
//   // Fetch all users on mount
//   // useEffect(() => {
//   //   fetchAllUsers();
//   // }, []);

// const fetchAllUsers = () => {
//   setLoading(true); // 👈 Start loading
//   axios.get('https://forty4technology-backend.onrender.com/api/users')
//     .then(res => {
//       setUsers(res.data);
//       alert('Users fetched successfully!');
//     })
//     .catch(err => {
//       console.error('Error fetching users:', err);
//       alert('Failed to fetch users. Check console for details.');
//     })
//     .finally(() => {
//       setLoading(false); // 👈 Stop loading
//     });
// };

// const fetchUserById = () => {
//   if (!getById.trim()) return;
//   setLoading(true);
//   axios.get(`https://forty4technology-backend.onrender.com/api/users/${getById}`)
//     .then(res => {
//       setUsers([res.data]); // 👈 Only show this one user
//       alert('User fetched successfully!');
//     })
//     .catch(err => {
//       console.error('Error fetching user:', err);
//       if (err.response && err.response.data && err.response.data.error) {
//         alert(err.response.data.error);
//       } else {
//         alert('Something went wrong. Please try again.');
//       }
//     })
//     .finally(() => {
//       setLoading(false);
//     });
// };


//   const handleDelete = (id) => {
//     if (window.confirm('Are you sure you want to delete this user?')) {
//       axios.delete(`https://forty4technology-backend.onrender.com/api/users/${id}`)
//         .then(() => {
//           setUsers(users.filter(user => user._id !== id));
//           alert('User deleted successfully!');
//         })
//         .catch(err => {
//           console.error('Error deleting user:', err);
//           alert('Failed to delete user. Check console for details.');
//         });
//     }
//   };

//   const handleEdit = (user) => {
//     setEditUser({ ...user });
//     setShowEditModal(true);
//   };

//   const handleSubmitEdit = (updatedUser) => {
//     axios.put(`https://forty4technology-backend.onrender.com/api/users/${updatedUser._id}`, updatedUser)
//       .then(res => {
//         setUsers(users.map(user => user._id === res.data._id ? res.data : user));
//         setShowEditModal(false);
//         setEditUser(null);
//         alert('User updated successfully!');
//       })
//       .catch(err => {
//         console.error('Error updating user:', err);
//         alert('Failed to update user. Check console for details.');
//       });
//   };

//   const navigateToCreateUser = () => {
//     navigate('/create-user');
//   };

//   const openUserDetail = (user) => {
//     setSelectedUser(user);
//     setShowUserDetail(true);
//   };

//   const closeUserDetail = () => {
//     setShowUserDetail(false);
//     setSelectedUser(null);
//   };

//   const closeEditModal = () => {
//     setShowEditModal(false);
//     setEditUser(null);
//     setFocusedInputId(null); // Clear focus when modal closes
//   };

//   const filteredUsers = users.filter(user =>
//     user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     user._id.includes(searchTerm)
//   );

//   // ======================
//   // Render
//   // ======================

//   return (
//     <div style={styles.container}>
//       <header style={styles.header}>
//         <h1 style={styles.title}>📊User Management Dashboard</h1>
//         <div style={styles.headerActions}>
//           <button
//             onClick={() => setViewMode(viewMode === 'cards' ? 'table' : 'cards')}
//             style={{
//               ...styles.viewToggle,
//               backgroundColor: hoveredButton === 'view' ? '#2980b9' : '#3498db',
//             }}
//             onMouseEnter={() => setHoveredButton('view')}
//             onMouseLeave={() => setHoveredButton(null)}
//             aria-label={`Switch to ${viewMode === 'cards' ? 'table' : 'card'} view`}
//           >
//             {viewMode === 'cards' ? <FaList /> : <FaTh />}
//             {viewMode === 'cards' ? 'Table View' : 'Card View'}
//           </button>
//           <button
//             onClick={navigateToCreateUser}
//             style={{
//               ...styles.createButton,
//               backgroundColor: hoveredButton === 'create' ? '#27ae60' : '#2ecc71',
//             }}
//             onMouseEnter={() => setHoveredButton('create')}
//             onMouseLeave={() => setHoveredButton(null)}
//             aria-label="Create new user"
//           >
//             <FaUserPlus /> Create User
//           </button>
//         </div>
//       </header>

//       <div style={styles.fetchContainer}>
//        <button
//   onClick={fetchAllUsers}
//   disabled={loading}
//   style={{
//     ...styles.fetchButton,
//     backgroundColor: hoveredButton === 'getAll' ? '#2980b9' : '#3498db',
//     opacity: loading ? 0.7 : 1,
//     cursor: loading ? 'not-allowed' : 'pointer',
//   }}
//   onMouseEnter={() => setHoveredButton('getAll')}
//   onMouseLeave={() => setHoveredButton(null)}
//   aria-label="Fetch all users"
// >
//   {loading ? (
//     <>
//       <FaSpinner className="fa-spin" /> Loading...
//     </>
//   ) : (
//     <>
//       <FaList /> Get All Users
//     </>
//   )}
// </button>
//         <div style={styles.getByIdContainer}>
//           <input
//             type="text"
//             placeholder="Enter User ID (e.g., 68c448c1d5fa9e28e4f3bae5)"
//             value={getById}
//             onChange={(e) => setGetById(e.target.value)}
//             style={{
//               ...styles.getByIdInput,
//               borderColor: focusedInputId === 'getById' ? '#3498db' : '#ddd',
//               boxShadow: focusedInputId === 'getById' ? '0 0 0 2px rgba(52, 152, 219, 0.2)' : 'none',
//             }}
//             onFocus={() => setFocusedInputId('getById')}
//             onBlur={() => setFocusedInputId(null)}
//             aria-label="Enter user ID to fetch"
//           />
//           <button
//             onClick={fetchUserById}
//             style={{
//               ...styles.fetchButton,
//               backgroundColor: hoveredButton === 'getById' ? '#27ae60' : '#2ecc71',
//             }}
//             onMouseEnter={() => setHoveredButton('getById')}
//             onMouseLeave={() => setHoveredButton(null)}
//             aria-label="Fetch user by ID"
//           >
//             <FaSearch /> Get User by ID
//           </button>
//         </div>
//       </div>

//       <div style={styles.searchContainer}>
//         <FaSearch style={styles.searchIcon} />
//         <input
//           type="text"
//           placeholder="Search by name, email, or ID..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           style={{
//             ...styles.searchInput,
//             borderColor: focusedInputId === 'search' ? '#3498db' : '#e0e0e0',
//             boxShadow: focusedInputId === 'search' ? '0 0 0 2px rgba(52, 152, 219, 0.2)' : 'none',
//           }}
//           onFocus={() => setFocusedInputId('search')}
//           onBlur={() => setFocusedInputId(null)}
//           aria-label="Search users"
//         />
//       </div>

//       {users.length === 0 ? (
//         <div style={styles.emptyState}>
//           <p>No users loaded. Click "Get All Users" or search by ID.</p>
//         </div>
//       ) : viewMode === 'cards' ? (
//         <div style={styles.userList}>
//           {filteredUsers.length > 0 ? (
//             filteredUsers.map(user => (
//               <UserCard
//                 key={user._id}
//                 user={user}
//                 onEdit={handleEdit}
//                 onDelete={handleDelete}
//                 onView={openUserDetail}
//                 hoveredCardId={hoveredCardId}
//                 setHoveredCardId={setHoveredCardId}
//                 focusedInputId={focusedInputId}
//                 setFocusedInputId={setFocusedInputId}
//               />
//             ))
//           ) : (
//             <p style={styles.noResults}>No users found matching "{searchTerm}".</p>
//           )}
//         </div>
//       ) : (
//         <UserTable
//           users={filteredUsers}
//           onEdit={handleEdit}
//           onDelete={handleDelete}
//           onView={openUserDetail}
//           hoveredCardId={hoveredCardId}
//           setHoveredCardId={setHoveredCardId}
//           focusedInputId={focusedInputId}
//           setFocusedInputId={setFocusedInputId}
//         />
//       )}

//       {showUserDetail && (
//         <UserDetailModal
//           user={selectedUser}
//           onClose={closeUserDetail}
//         />
//       )}

//       {showEditModal && (
//         <EditUserModal
//           user={editUser}
//           onSave={handleSubmitEdit}
//           onCancel={closeEditModal}
//           focusedInputId={focusedInputId}
//           setFocusedInputId={setFocusedInputId}
//         />
//       )}
//     </div>
//   );
// }

// // ======================
// // STYLES (Optimized & Modernized) — ALL INLINE, NO EXTERNAL CSS
// // ======================

// const styles = {
//     container: {
//     maxWidth: '1900px',
//     margin: '0 auto',
//     padding: '20px',
//     fontFamily: "'Segoe UI', 'Roboto', 'Helvetica Neue', sans-serif",
//     backgroundColor: '#f5f7fa',

//     // 👇 force container scrolling
  
//     overflowY: 'auto',
//     overflowX: 'hidden',
//   },
//   header: {
//     display: 'flex',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: '30px',
//     flexWrap: 'wrap',
//     gap: '15px',
//     padding: '0 10px',
//   },
//   title: {
//     color: '#2c3e50',
//     fontSize: '2.2em',
//     fontWeight: '600',
//     margin: 0,
//     fontFamily: "'Montserrat', sans-serif",
//     textShadow: '1px 1px 3px rgba(0,0,0,0.1)',
//   },
//   headerActions: {
//     display: 'flex',
//     gap: '15px',
//     flexWrap: 'wrap',
//   },
//   viewToggle: {
//     padding: '10px 16px',
//     backgroundColor: '#3498db',
//     color: 'white',
//     border: 'none',
//     borderRadius: '8px',
//     cursor: 'pointer',
//     fontSize: '0.9em',
//     display: 'flex',
//     alignItems: 'center',
//     gap: '6px',
//     transition: 'background-color 0.3s ease, transform 0.2s',
//     boxShadow: '0 3px 8px rgba(0,0,0,0.1)',
//   },
//   createButton: {
//     padding: '10px 16px',
//     backgroundColor: '#2ecc71',
//     color: 'white',
//     border: 'none',
//     borderRadius: '8px',
//     cursor: 'pointer',
//     fontSize: '0.9em',
//     display: 'flex',
//     alignItems: 'center',
//     gap: '6px',
//     transition: 'background-color 0.3s ease, transform 0.2s',
//     boxShadow: '0 3px 8px rgba(0,0,0,0.1)',
//   },
//   fetchContainer: {
//     display: 'flex',
//     justifyContent: 'center',
//     gap: '20px',
//     marginBottom: '30px',
//     alignItems: 'center',
//     flexWrap: 'wrap',
//     padding: '0 10px',
//   },
//   fetchButton: {
//     padding: '12px 24px',
//     color: 'white',
//     border: 'none',
//     borderRadius: '8px',
//     cursor: 'pointer',
//     fontSize: '1em',
//     fontWeight: '600',
//     display: 'flex',
//     alignItems: 'center',
//     gap: '8px',
//     transition: 'background-color 0.3s ease, transform 0.2s',
//     boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
//   },
//   getByIdContainer: {
//     display: 'flex',
//     gap: '10px',
//     alignItems: 'center',
//     flexWrap: 'nowrap',
//   },
//   getByIdInput: {
//     padding: '12px',
//     borderRadius: '6px',
//     border: '1px solid #ddd',
//     fontSize: '0.9em',
//     width: '280px',
//     outline: 'none',
//     transition: 'border-color 0.3s, box-shadow 0.3s',
//   },
//   searchContainer: {
//     display: 'flex',
//     alignItems: 'center',
//     marginBottom: '30px',
//     backgroundColor: 'white',
//     borderRadius: '8px',
//     padding: '8px 15px',
//     boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
//     maxWidth: '500px',
//     margin: '0 auto',
//     marginBottom:'14px',marginBottom:'20px',
//     border: '1px solid #e0e0e0',
//   },
//   searchIcon: {
//     color: '#7f8c8d',
//     fontSize: '1.2em',
//     padding: '10px',
//   },
//   searchInput: {
//     flex: 1,
//     border: '1px solid #e0e0e0',
//     outline: 'none',
//     padding: '10px',
//     fontSize: '0.9em',
//     borderRadius: '5px',
//     color: '#2c3e50',
//     transition: 'border-color 0.3s, box-shadow 0.3s',
//   },
//   emptyState: {
//     textAlign: 'center',
//     color: '#7f8c8d',
//     fontSize: '1.2em',
//     padding: '40px',
//     backgroundColor: 'white',
//     borderRadius: '12px',
//     boxShadow: '0 6px 16px rgba(0,0,0,0.1)',
//     marginBottom: '40px',
//     fontStyle: 'italic',
//   },
//   userList: {
//     display: 'grid',
//     gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
//     gap: '20px',
//     marginBottom: '40px',
//     padding: '0 10px',
//   },
//   userCard: {
//     backgroundColor: 'white',
//     borderRadius: '16px',
//     padding: '20px',
//     boxShadow: '0 6px 16px rgba(0,0,0,0.1)',
//     transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s',
//     position: 'relative',
//     overflow: 'hidden',
//     cursor: 'pointer',
//     borderLeft: '4px solid #3498db',
//   },
//   userIdContainer: {
//     display: 'flex',
//     alignItems: 'center',
//     gap: '8px',
//     marginBottom: '16px',
//     padding: '8px',
//     backgroundColor: '#f8f9fa',
//     borderRadius: '8px',
//   },
//   idIcon: {
//     color: '#e74c3c',
//     fontSize: '1.3em',
//   },
//   idKey: {
//     color: '#e74c3c',
//     fontWeight: 'bold',
//     fontSize: '0.9em',
//     textTransform: 'uppercase',
//     letterSpacing: '0.5px',
//   },
//   userId: {
//     backgroundColor: '#fadbd8',
//     color: '#c0392b',
//     padding: '6px 14px',
//     borderRadius: '20px',
//     fontSize: '0.85em',
//     fontWeight: 'bold',
//     wordBreak: 'break-all',
//     fontFamily: 'monospace',
//   },
//   userName: {
//     margin: '0 0 16px 0',
//     color: '#2c3e50',
//     fontSize: '1.6em',
//     fontWeight: '700',
//     fontFamily: "'Montserrat', sans-serif",
//     textAlign: 'center',
//     textShadow: '1px 1px 2px rgba(0,0,0,0.05)',
//   },
//   userInfo: {
//     margin: '16px 0',
//     display: 'flex',
//     flexDirection: 'column',
//     gap: '10px',
//   },
//   infoItem: {
//     display: 'flex',
//     alignItems: 'center',
//     gap: '10px',
//     backgroundColor: '#e8f4fd',
//     padding: '10px 14px',
//     borderRadius: '8px',
//     fontSize: '0.9em',
//     borderLeft: '3px solid #3498db',
//   },
//   infoIcon: {
//     color: '#3498db',
//     fontSize: '1.1em',
//   },
//   infoText: {
//     color: '#2c3e50',
//     fontWeight: '500',
//   },
//   buttonGroup: {
//     display: 'flex',
//     gap: '10px',
//     marginTop: '20px',
//     justifyContent: 'center',
//   },
//   editButton: {
//     padding: '8px 16px',
//     backgroundColor: '#f39c12',
//     color: 'white',
//     border: 'none',
//     borderRadius: '8px',
//     cursor: 'pointer',
//     display: 'flex',
//     alignItems: 'center',
//     gap: '6px',
//     fontSize: '0.9em',
//     fontWeight: '600',
//     transition: 'background-color 0.3s, transform 0.2s',
//     boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
//   },
//   deleteButton: {
//     padding: '8px 16px',
//     backgroundColor: '#e74c3c',
//     color: 'white',
//     border: 'none',
//     borderRadius: '8px',
//     cursor: 'pointer',
//     display: 'flex',
//     alignItems: 'center',
//     gap: '6px',
//     fontSize: '0.9em',
//     fontWeight: '600',
//     transition: 'background-color 0.3s, transform 0.2s',
//     boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
//   },
//   noResults: {
//     textAlign: 'center',
//     color: '#7f8c8d',
//     fontSize: '1.1em',
//     gridColumn: '1 / -1',
//     padding: '40px',
//     fontStyle: 'italic',
//   },
//   tableContainer: {
//     backgroundColor: 'white',
//     borderRadius: '16px',
//     boxShadow: '0 6px 16px rgba(0,0,0,0.1)',
//     overflow: 'hidden',
//     marginBottom: '40px',
//     margin: '0 10px',
//   },
//   tableWrapper: {
//     overflowX: 'auto',
//   },
//   table: {
//     width: '100%',
//     borderCollapse: 'collapse',
//     fontSize: '0.9em',
//     minWidth: '800px',
//   },
//   tableHeader: {
//     backgroundColor: '#3498db',
//     color: 'white',
//     textAlign: 'left',
//   },
//   tableHeaderTh: {
//     padding: '16px',
//     fontWeight: '600',
//     fontFamily: "'Montserrat', sans-serif",
//     textTransform: 'uppercase',
//     letterSpacing: '0.5px',
//     fontSize: '0.9em',
//   },
//   tableRow: {
//     borderBottom: '1px solid #eee',
//     transition: 'background-color 0.2s ease',
//     cursor: 'pointer',
//     height: '56px',
//   },
//   tableHeaderTd: {
//     padding: '12px 16px',
//     verticalAlign: 'top',
//     fontSize: '0.85em',
//     color: '#2c3e50',
//   },
//   tableActions: {
//     display: 'flex',
//     gap: '8px',
//     justifyContent: 'center',
//   },
//   tableEditButton: {
//     padding: '6px 10px',
//     backgroundColor: '#f39c12',
//     color: 'white',
//     border: 'none',
//     borderRadius: '6px',
//     cursor: 'pointer',
//     fontSize: '0.85em',
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//     minWidth: '36px',
//     transition: 'background-color 0.2s',
//     boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
//   },
//   tableDeleteButton: {
//     padding: '6px 10px',
//     backgroundColor: '#e74c3c',
//     color: 'white',
//     border: 'none',
//     borderRadius: '6px',
//     cursor: 'pointer',
//     fontSize: '0.85em',
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//     minWidth: '36px',
//     transition: 'background-color 0.2s',
//     boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
//   },
//   modalOverlay: {
//     position: 'fixed',
//     top: 0,
//     left: 0,
//     width: '100%',
//     height: '100%',
//     backgroundColor: 'rgba(0,0,0,0.6)',
//     display: 'flex',
//     justifyContent: 'center',
//     alignItems: 'center',
//     zIndex: 1000,
//     padding: '20px',
//     backdropFilter: 'blur(5px)',
//   },
//   userDetailModal: {
//     backgroundColor: 'white',
//     borderRadius: '20px',
//     width: '100%',
//     maxWidth: '900px',
//     maxHeight: '80vh',
//     overflowY: 'auto',
//     boxShadow: '0 30px 60px rgba(0,0,0,0.3)',
//     position: 'relative',
//     padding: '30px',
//     animation: 'slideUp 0.4s ease-out',
//   },
//   editModalContent: {
//     backgroundColor: 'white',
//     borderRadius: '20px',
//     width: '100%',
//     maxWidth: '720px',
//     maxHeight: '90vh',
//     overflowY: 'auto',
//     boxShadow: '0 30px 60px rgba(0,0,0,0.3)',
//     position: 'relative',
//     padding: '30px',
//     animation: 'slideUp 0.4s ease-out',
//   },
//   modalHeader: {
//     display: 'flex',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: '0 0 24px',
//     borderBottom: '1px solid #eee',
//     marginBottom: '24px',
//   },
//   modalTitle: {
//     margin: 0,
//     color: '#2c3e50',
//     fontSize: '1.8em',
//     fontWeight: '700',
//     fontFamily: "'Montserrat', sans-serif",
//     display: 'flex',
//     alignItems: 'center',
//     gap: '10px',
//   },
//   closeButton: {
//     background: 'none',
//     border: 'none',
//     fontSize: '1.8em',
//     cursor: 'pointer',
//     color: '#7f8c8d',
//     padding: '8px',
//     borderRadius: '50%',
//     transition: 'background-color 0.3s, color 0.3s',
//     backgroundColor: 'transparent',
//   },
//   userDetailContent: {
//     display: 'flex',
//     flexDirection: 'column',
//     gap: '24px',
//   },
//   detailSection: {
//     backgroundColor: '#f5f9faff',
//     padding: '20px',
//     fontWeight:'bold',
//     borderRadius: '12px',
//     borderLeft: '4px solid #063629ff',
//     boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
//   },
//   sectionTitle: {
//     margin: '0 0 16px 0',
//     color: '#14422eff',
//     fontSize: '1.3em',
//     fontWeight: '600',
//     fontFamily: "'Montserrat', sans-serif",
//     display: 'flex',
//     alignItems: 'center',
//     gap: '10px',
//     textTransform: 'capitalize',
//   },
//   detailRow: {
//     display: 'flex',
//     marginBottom: '6px',
//     alignItems: 'center',
//     gap: '12px',
//   },
//   detailLabel: {
//     fontWeight: '600',
//     color: '#7f8c8d',
//     minWidth: '140px',
//     flexShrink: 0,
//   },
//   detailText: {
//     color: '#2c3e50',
//     fontSize: '0.95em',
//     lineHeight: '1.5',
//   },
//   fullIdText: {
//     color: '#130017ff',
//     fontFamily: 'monospace',
//     fontSize: '0.9em',
//     padding: '12px',
//     backgroundColor: '#fff0f0',
//     borderRadius: '8px',
//     wordBreak: 'break-all',
//     borderLeft: '3px solid #e74c3c',
//   },rowGroup: {
//   display: 'flex',
//   justifyContent: 'space-between',
//   gap: '20px',
//   marginBottom: '12px',
// },
// detailRow: {
//   flex: 1, // allow equal width
//   display: 'flex',
//   gap: '8px',
// },

//   form: {
//     padding: '24px',
//     display: 'flex',
//     flexDirection: 'column',
//     gap: '24px',
//   },
//   section: {
//     backgroundColor: '#fafafa',
//     padding: '20px',
//     borderRadius: '12px',
//     borderLeft: '4px solid #3498db',
//     boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
//   },
//   inputGroup: {
//     marginBottom: '18px',
//   },
//   input: {
//     width: '100%',
//     padding: '12px',
//     borderRadius: '8px',
//     border: '1px solid #ddd',
//     fontSize: '0.9em',
//     boxSizing: 'border-box',
//     transition: 'border-color 0.3s, box-shadow 0.3s',
//     outline: 'none',
//   },
//   buttonRow: {
//     display: 'flex',
//     gap: '15px',
//     justifyContent: 'flex-end',
//     marginTop: '24px',
//     padding: '16px 0',
//     borderTop: '1px solid #eee',
//   },
//   submitButton: {
//     padding: '12px 24px',
//     backgroundColor: '#2ecc71',
//     color: 'white',
//     border: 'none',
//     borderRadius: '10px',
//     cursor: 'pointer',
//     fontSize: '1em',
//     fontWeight: '600',
//     display: 'flex',
//     alignItems: 'center',
//     gap: '8px',
//     transition: 'background-color 0.3s, transform 0.2s',
//     boxShadow: '0 4px 14px rgba(46, 204, 113, 0.3)',
//   },
//   cancelButton: {
//     padding: '12px 24px',
//     backgroundColor: '#95a5a6',
//     color: 'white',
//     border: 'none',
//     borderRadius: '10px',
//     cursor: 'pointer',
//     fontSize: '1em',
//     fontWeight: '600',
//     display: 'flex',
//     alignItems: 'center',
//     gap: '8px',
//     transition: 'background-color 0.3s, transform 0.2s',
//     boxShadow: '0 4px 14px rgba(149, 165, 166, 0.3)',
//   },
// };

// // Add global animations
// const globalStyles = document.createElement('style');
// globalStyles.textContent = `
//   @keyframes slideUp {
//     from {
//       opacity: 0;
//       transform: translateY(30px);
//     }
//     to {
//       opacity: 1;
//       transform: translateY(0);
//     }
//   }
// `;
// document.head.appendChild(globalStyles);

// // Ensure responsive behavior on mobile
// if (typeof window !== 'undefined') {
//   const resizeHandler = () => {
//     const root = document.documentElement;
//     const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
//     root.style.setProperty('--vw', `${vw}px`);
//   };
//   window.addEventListener('resize', resizeHandler);
//   resizeHandler();
// }
