import { useEffect, useState } from "react";
import "./App.css";
import Login from "./Login";

const API_URL = "http://localhost:5000/api/leads";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("crmToken")
  );
  const handleLogin = () => {
  setIsLoggedIn(true);
};

const handleLogout = () => {
  localStorage.removeItem("crmToken");
  setIsLoggedIn(false);
};

  const [leads, setLeads] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingLead, setEditingLead] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    source: "Website",
    status: "new",
    notes: "",
    followUpDate: ""
  });
  // Get all leads
  const fetchLeads = async () => {
    try {
   const response = await fetch(API_URL, {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("crmToken")}`
  }
});
      const data = await response.json();
      setLeads(data);
    } catch (error) {
      console.error("Error fetching leads:", error);
    }
  };

  useEffect(() => {
  if (isLoggedIn) {
    fetchLeads();
  }
}, [isLoggedIn]);
  // Handle form changes
  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    });
  };

  // Add new lead
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("crmToken")}`
},
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error("Failed to create lead");
      }

      setFormData({
        name: "",
        email: "",
        phone: "",
        source: "Website",
        status: "new",
        notes: "",
        followUpDate: ""
      });

      setShowForm(false);
      fetchLeads();
    } catch (error) {
      console.error(error);
      alert("Could not add lead");
    }
  };

  // Update lead status
  const updateStatus = async (id, status) => {
    try {
      await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("crmToken")}`
},
        body: JSON.stringify({ status })
      });

      fetchLeads();
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };
  // 👇 ADD THE NEW CODE HERE

// Edit lead
const handleEdit = (lead) => {
  setEditingLead({
    ...lead,
    followUpDate: lead.followUpDate
      ? lead.followUpDate.substring(0, 10)
      : ""
  });
};

// Save edited lead
const saveEditedLead = async (event) => {
  event.preventDefault();

  try {
    const response = await fetch(
      `${API_URL}/${editingLead._id}`,
      {
        method: "PUT",
        headers: {
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("crmToken")}`
},
        body: JSON.stringify({
          name: editingLead.name,
          email: editingLead.email,
          phone: editingLead.phone,
          source: editingLead.source,
          status: editingLead.status,
          notes: editingLead.notes,
          followUpDate: editingLead.followUpDate || null
        })
      }
    );

    if (!response.ok) {
      throw new Error("Failed to update lead");
    }

    setEditingLead(null);
    fetchLeads();

  } catch (error) {
    console.error("Error updating lead:", error);
    alert("Could not update lead");
  }
};


  // Delete lead
  const deleteLead = async (id) => {
    if (!window.confirm("Are you sure you want to delete this lead?")) {
      return;
    }

    try {
      await fetch(`${API_URL}/${id}`, {
  method: "DELETE",
  headers: {
    Authorization: `Bearer ${localStorage.getItem("crmToken")}`
  }
});

      fetchLeads();
    } catch (error) {
      console.error("Error deleting lead:", error);
    }
  };

  const totalLeads = leads.length;
  const newLeads = leads.filter((lead) => lead.status === "new").length;
  const contactedLeads = leads.filter(
    (lead) => lead.status === "contacted"
  ).length;
  const convertedLeads = leads.filter(
    (lead) => lead.status === "converted"
  ).length;
  const filteredLeads = leads.filter((lead) => {
  const matchesSearch =
    lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.email.toLowerCase().includes(searchTerm.toLowerCase());

  const matchesStatus =
    statusFilter === "all" || lead.status === statusFilter;

  return matchesSearch && matchesStatus;
});

if (!isLoggedIn) {
  return <Login onLogin={handleLogin} />;
}

return (
  <div className="app">

      {/* Sidebar */}
      <aside className="sidebar">
        <div className="logo">
          <div className="logo-icon">C</div>
          <span>ClientFlow</span>
        </div>

        <nav>
          <div className="nav-item active">
            📊 Dashboard
          </div>

          <div className="nav-item">
            👥 Leads
          </div>

          <div className="nav-item">
            📅 Follow-ups
          </div>
        </nav>

        <div className="sidebar-bottom">
          <div className="nav-item">
            ⚙️ Settings
            <button
  className="nav-item logout-button"
  onClick={handleLogout}
>
  🚪 Logout
</button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main">

        {/* Header */}
        <header className="header">
          <div>
            <h1>CRM Dashboard</h1>
            <p>Manage your client leads and follow-ups.</p>
          </div>

          <button
            className="add-button"
            onClick={() => setShowForm(true)}
          >
            + Add Lead
          </button>
        </header>

        {/* Statistics */}
        <section className="stats">

          <div className="stat-card">
            <div>
              <p>Total Leads</p>
              <h2>{totalLeads}</h2>
            </div>
            <span className="stat-icon">👥</span>
          </div>

          <div className="stat-card">
            <div>
              <p>New Leads</p>
              <h2>{newLeads}</h2>
            </div>
            <span className="stat-icon">✨</span>
          </div>

          <div className="stat-card">
            <div>
              <p>Contacted</p>
              <h2>{contactedLeads}</h2>
            </div>
            <span className="stat-icon">📞</span>
          </div>

          <div className="stat-card">
            <div>
              <p>Converted</p>
              <h2>{convertedLeads}</h2>
            </div>
            <span className="stat-icon">🎯</span>
          </div>

        </section>

        {/* Leads Section */}
        <section className="leads-card">

          <div className="section-header">
  <div>
    <h2>Recent Leads</h2>
    <p>View and manage your incoming client leads.</p>
  </div>

  <div className="filters">

    <input
      type="text"
      placeholder="🔎 Search leads..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className="search-input"
    />

    <select
      value={statusFilter}
      onChange={(e) => setStatusFilter(e.target.value)}
      className="filter-select"
    >
      <option value="all">All Statuses</option>
      <option value="new">New</option>
      <option value="contacted">Contacted</option>
      <option value="converted">Converted</option>
    </select>

  </div>
</div>

          {leads.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">👥</div>
              <h3>No leads yet</h3>
              <p>Add your first client lead to get started.</p>

              <button
                className="add-button"
                onClick={() => setShowForm(true)}
              >
                + Add Your First Lead
              </button>
            </div>
          ) : (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Source</th>
                    <th>Status</th>
                    <th>Follow-up</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                 {filteredLeads.map((lead) => (
                    <tr key={lead._id}>

                      <td>
                        <strong>{lead.name}</strong>
                      </td>

                      <td>{lead.email}</td>

                      <td>
                        <span className="source">
                          {lead.source}
                        </span>
                      </td>

                      <td>
                        <select
                          value={lead.status}
                          onChange={(e) =>
                            updateStatus(
                              lead._id,
                              e.target.value
                            )
                          }
                          className={`status ${lead.status}`}
                        >
                          <option value="new">New</option>
                          <option value="contacted">
                            Contacted
                          </option>
                          <option value="converted">
                            Converted
                          </option>
                        </select>
                      </td>

                      <td>
                        {lead.followUpDate
                          ? new Date(
                              lead.followUpDate
                            ).toLocaleDateString()
                          : "—"}
                      </td>

                      <td>
  <button
    className="edit-button"
    onClick={() => handleEdit(lead)}
  >
    Edit
  </button>

  <button
    className="delete-button"
    onClick={() => deleteLead(lead._id)}
  >
    Delete
  </button>
</td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        </section>

      </main>

      {/* Add Lead Modal */}
      {showForm && (
        <div className="modal-overlay">

          <div className="modal">

            <div className="modal-header">
              <div>
                <h2>Add New Lead</h2>
                <p>Enter the client's information below.</p>
              </div>

              <button
                className="close-button"
                onClick={() => setShowForm(false)}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit}>

              <div className="form-grid">

                <div className="form-group">
                  <label>Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Client name"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="client@example.com"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Phone</label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Phone number"
                  />
                </div>

                <div className="form-group">
                  <label>Source</label>
                  <select
                    name="source"
                    value={formData.source}
                    onChange={handleChange}
                  >
                    <option value="Website">Website</option>
                    <option value="LinkedIn">LinkedIn</option>
                    <option value="Referral">Referral</option>
                    <option value="Instagram">Instagram</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                  >
                    <option value="new">New</option>
                    <option value="contacted">
                      Contacted
                    </option>
                    <option value="converted">
                      Converted
                    </option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Follow-up Date</label>
                  <input
                    type="date"
                    name="followUpDate"
                    value={formData.followUpDate}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group full-width">
                  <label>Notes</label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    placeholder="Add notes about this lead..."
                    rows="4"
                  />
                </div>

              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="cancel-button"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="add-button"
                >
                  Add Lead
                </button>
              </div>

            </form>

          </div>

        </div>
      )}
            

      {/* Edit Lead Modal */}
      {editingLead && (
        <div className="modal-overlay">
          <div className="modal">

            <div className="modal-header">
              <div>
                <h2>Edit Lead</h2>
                <p>Update lead information and follow-up notes.</p>
              </div>

              <button
                className="close-button"
                onClick={() => setEditingLead(null)}
              >
                ×
              </button>
            </div>

            <form onSubmit={saveEditedLead}>

              <div className="form-grid">

                <div className="form-group">
                  <label>Name *</label>
                  <input
                    type="text"
                    value={editingLead.name}
                    onChange={(e) =>
                      setEditingLead({
                        ...editingLead,
                        name: e.target.value
                      })
                    }
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    value={editingLead.email}
                    onChange={(e) =>
                      setEditingLead({
                        ...editingLead,
                        email: e.target.value
                      })
                    }
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Phone</label>
                  <input
                    type="text"
                    value={editingLead.phone || ""}
                    onChange={(e) =>
                      setEditingLead({
                        ...editingLead,
                        phone: e.target.value
                      })
                    }
                  />
                </div>

                <div className="form-group">
                  <label>Source</label>
                  <select
                    value={editingLead.source}
                    onChange={(e) =>
                      setEditingLead({
                        ...editingLead,
                        source: e.target.value
                      })
                    }
                  >
                    <option value="Website">Website</option>
                    <option value="LinkedIn">LinkedIn</option>
                    <option value="Referral">Referral</option>
                    <option value="Instagram">Instagram</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Status</label>
                  <select
                    value={editingLead.status}
                    onChange={(e) =>
                      setEditingLead({
                        ...editingLead,
                        status: e.target.value
                      })
                    }
                  >
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="converted">Converted</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Follow-up Date</label>
                  <input
                    type="date"
                    value={editingLead.followUpDate || ""}
                    onChange={(e) =>
                      setEditingLead({
                        ...editingLead,
                        followUpDate: e.target.value
                      })
                    }
                  />
                </div>

                <div className="form-group full-width">
                  <label>Notes</label>
                  <textarea
                    value={editingLead.notes || ""}
                    onChange={(e) =>
                      setEditingLead({
                        ...editingLead,
                        notes: e.target.value
                      })
                    }
                    placeholder="Add follow-up notes..."
                    rows="5"
                  />
                </div>

              </div>

              <div className="form-actions">

                <button
                  type="button"
                  className="cancel-button"
                  onClick={() => setEditingLead(null)}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="add-button"
                >
                  Save Changes
                </button>

              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}

  

export default App;