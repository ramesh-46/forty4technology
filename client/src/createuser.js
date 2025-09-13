import React, { useState } from "react";
import axios from "axios";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaBuilding,
  FaMapMarkerAlt,
  FaSave,
  FaTimes,
  FaMapPin,
  FaCity,
  FaHome,
  FaGlobeAmericas,
  FaStreetView,
} from "react-icons/fa";

export default function CreateUserPage() {
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    address: {
      street: "",
      city: "",
      zipcode: "",
      geo: { lat: "", lng: "" },
    },
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!newUser.name) newErrors.name = "Name is required";
    if (!newUser.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newUser.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!newUser.phone) {
      newErrors.phone = "Phone is required";
    } else if (!/^\d{10}$/.test(newUser.phone)) {
      newErrors.phone = "Phone must be 10 digits";
    }
    if (!newUser.company) newErrors.company = "Company is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);
      axios
        .post("https://forty4technology-backend.onrender.com/api/users", newUser)
        .then(() => (window.location.href = "/"))
        .catch((err) => {
          console.error(err);
          alert("Failed to create user. Check console for details.");
        })
        .finally(() => setIsSubmitting(false));
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.title}>✨ Create New User</h1>
        <form onSubmit={handleSubmit} style={styles.form}>
          {/* Basic Info Grid */}
          <div style={styles.grid}>
            {/* Name */}
            <div style={styles.inputGroup}>
              <FaUser style={styles.icon} />
              <input
                type="text"
                value={newUser.name}
                onChange={(e) =>
                  setNewUser({ ...newUser, name: e.target.value })
                }
                style={{
                  ...styles.input,
                  borderColor: errors.name ? "#e74c3c" : "#ddd",
                }}
                placeholder="Full Name"
                required
              />
              {errors.name && <span style={styles.error}>{errors.name}</span>}
            </div>
            {/* Email */}
            <div style={styles.inputGroup}>
              <FaEnvelope style={styles.icon} />
              <input
                type="email"
                value={newUser.email}
                onChange={(e) =>
                  setNewUser({ ...newUser, email: e.target.value })
                }
                style={{
                  ...styles.input,
                  borderColor: errors.email ? "#e74c3c" : "#ddd",
                }}
                placeholder="Email"
                required
              />
              {errors.email && <span style={styles.error}>{errors.email}</span>}
            </div>
            {/* Phone */}
            <div style={styles.inputGroup}>
              <FaPhone style={styles.icon} />
              <input
                type="text"
                value={newUser.phone}
                onChange={(e) =>
                  setNewUser({ ...newUser, phone: e.target.value })
                }
                style={{
                  ...styles.input,
                  borderColor: errors.phone ? "#e74c3c" : "#ddd",
                }}
                placeholder="10-digit Phone"
                required
              />
              {errors.phone && <span style={styles.error}>{errors.phone}</span>}
            </div>
            {/* Company */}
            <div style={styles.inputGroup}>
              <FaBuilding style={styles.icon} />
              <input
                type="text"
                value={newUser.company}
                onChange={(e) =>
                  setNewUser({ ...newUser, company: e.target.value })
                }
                style={{
                  ...styles.input,
                  borderColor: errors.company ? "#e74c3c" : "#ddd",
                }}
                placeholder="Company"
                required
              />
              {errors.company && (
                <span style={styles.error}>{errors.company}</span>
              )}
            </div>
          </div>

          {/* Address Section */}
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>
              <FaHome /> Address Details
            </h3>
            <div style={styles.grid}>
              <div style={styles.inputGroup}>
                <FaStreetView style={styles.icon} />
                <input
                  type="text"
                  value={newUser.address.street}
                  onChange={(e) =>
                    setNewUser({
                      ...newUser,
                      address: { ...newUser.address, street: e.target.value },
                    })
                  }
                  style={styles.input}
                  placeholder="Street"
                />
              </div>
              <div style={styles.inputGroup}>
                <FaCity style={styles.icon} />
                <input
                  type="text"
                  value={newUser.address.city}
                  onChange={(e) =>
                    setNewUser({
                      ...newUser,
                      address: { ...newUser.address, city: e.target.value },
                    })
                  }
                  style={styles.input}
                  placeholder="City"
                />
              </div>
              <div style={styles.inputGroup}>
                <FaGlobeAmericas style={styles.icon} />
                <input
                  type="text"
                  value={newUser.address.zipcode}
                  onChange={(e) =>
                    setNewUser({
                      ...newUser,
                      address: { ...newUser.address, zipcode: e.target.value },
                    })
                  }
                  style={styles.input}
                  placeholder="ZIP Code"
                />
              </div>
              <div style={styles.inputGroup}>
                <FaMapPin style={styles.icon} />
                <input
                  type="text"
                  value={newUser.address.geo.lat}
                  onChange={(e) =>
                    setNewUser({
                      ...newUser,
                      address: {
                        ...newUser.address,
                        geo: { ...newUser.address.geo, lat: e.target.value },
                      },
                    })
                  }
                  style={styles.input}
                  placeholder="Latitude"
                />
              </div>
              <div style={styles.inputGroup}>
                <FaMapPin style={styles.icon} />
                <input
                  type="text"
                  value={newUser.address.geo.lng}
                  onChange={(e) =>
                    setNewUser({
                      ...newUser,
                      address: {
                        ...newUser.address,
                        geo: { ...newUser.address.geo, lng: e.target.value },
                      },
                    })
                  }
                  style={styles.input}
                  placeholder="Longitude"
                />
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div style={styles.buttonGroup}>
            <button
              type="submit"
              style={
                isSubmitting
                  ? { ...styles.submitButton, ...styles.submitting }
                  : styles.submitButton
              }
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span>Creating...</span>
              ) : (
                <>
                  <FaSave /> Create User
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => (window.location.href = "/")}
              style={styles.cancelButton}
            >
              <FaTimes /> Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #f0f4f8, #d9e4ec)",
    padding: "20px",
  },
  container: {
    width: "100%",
    maxWidth: "900px",
    backgroundColor: "#fff",
    borderRadius: "12px",
    boxShadow: "0 6px 18px rgba(0,0,0,0.1)",
    padding: "40px",
  },
  title: {
    textAlign: "center",
    color: "#2c3e50",
    fontSize: "2em",
    marginBottom: "25px",
    fontWeight: "600",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  section: {
    backgroundColor: "#f9fbfc",
    padding: "20px",
    borderRadius: "10px",
    borderLeft: "4px solid #3498db",
  },
  sectionTitle: {
    margin: "0 0 15px 0",
    color: "#2c3e50",
    fontSize: "1.2em",
    fontWeight: "600",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "18px",
  },
  inputGroup: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    position: "relative",
  },
  icon: {
    color: "#3498db",
    fontSize: "1.1em",
  },
  input: {
    flex: 1,
    padding: "12px 14px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    fontSize: "0.95em",
    transition: "border-color 0.3s, box-shadow 0.3s",
  },
  error: {
    color: "#e74c3c",
    fontSize: "0.8em",
    position: "absolute",
    bottom: "-18px",
    left: "32px",
  },
  buttonGroup: {
    display: "flex",
    gap: "15px",
    marginTop: "10px",
    flexWrap: "wrap",
  },
  submitButton: {
    flex: 1,
    padding: "12px",
    backgroundColor: "#2ecc71",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "1em",
    fontWeight: "600",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    transition: "background-color 0.3s, transform 0.2s",
  },
  submitting: {
    backgroundColor: "#95a5a6",
    cursor: "not-allowed",
  },
  cancelButton: {
    flex: 1,
    padding: "12px",
    backgroundColor: "#e74c3c",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "1em",
    fontWeight: "600",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    transition: "background-color 0.3s, transform 0.2s",
  },
};
