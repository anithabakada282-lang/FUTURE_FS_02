import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import AddLead from "./AddLead";

export default function Dashboard() {
  const [leads, setLeads] = useState([]);
  const [noteText, setNoteText] = useState({});
  const [filter, setFilter] = useState("all");

  const navigate = useNavigate();

  // ✅ Fetch leads (stable function)
  const fetchLeads = useCallback(async () => {
    try {
      const res = await API.get("/leads");
      setLeads(res.data);
    } catch (error) {
      console.error("Error fetching leads:", error);
    }
  }, []);

  // 🔐 Protect route + load data
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
    } else {
      fetchLeads();
    }
  }, [navigate, fetchLeads]);

  // Update status
  const updateStatus = async (id, status) => {
    try {
      await API.put(`/leads/${id}/status`, { status });
      fetchLeads();
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  // Add note
  const addNote = async (id) => {
    if (!noteText[id]) return;

    try {
      await API.post(`/leads/${id}/notes`, { text: noteText[id] });

      setNoteText((prev) => ({
        ...prev,
        [id]: "",
      }));

      fetchLeads();
    } catch (error) {
      console.error("Error adding note:", error);
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // Filter leads
  const filteredLeads =
    filter === "all"
      ? leads
      : leads.filter((lead) => lead.status === filter);

  // Stats
  const totalLeads = leads.length;
  const convertedLeads = leads.filter(
    (l) => l.status === "converted"
  ).length;
  const contactedLeads = leads.filter(
    (l) => l.status === "contacted"
  ).length;

  return (
    <div style={{ display: "flex", fontFamily: "Arial" }}>
      
      {/* Sidebar */}
      <div
        style={{
          width: "220px",
          background: "#1e293b",
          color: "#fff",
          height: "100vh",
          padding: "20px",
        }}
      >
        <h2>Mini CRM</h2>
        <p style={{ marginTop: 20 }}>Dashboard</p>

        <button
          onClick={handleLogout}
          style={{
            marginTop: "20px",
            padding: "10px",
            width: "100%",
            background: "#ef4444",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: "20px", background: "#f1f5f9" }}>
        
        <h1 style={{ marginBottom: 20 }}>Dashboard</h1>

        {/* Stats */}
        <div style={{ display: "flex", gap: 20, marginBottom: 20 }}>
          <div style={cardStyle}>
            <h3>Total Leads</h3>
            <p>{totalLeads}</p>
          </div>

          <div style={cardStyle}>
            <h3>Contacted</h3>
            <p>{contactedLeads}</p>
          </div>

          <div style={cardStyle}>
            <h3>Converted</h3>
            <p>{convertedLeads}</p>
          </div>
        </div>

        {/* Filters */}
        <div style={{ marginBottom: 20 }}>
          <button onClick={() => setFilter("all")}>All</button>
          <button onClick={() => setFilter("New")}>New</button>
          <button onClick={() => setFilter("contacted")}>Contacted</button>
          <button onClick={() => setFilter("converted")}>Converted</button>
        </div>

        {/* Add Lead */}
        <div style={cardStyle}>
          <AddLead />
        </div>

        {/* Leads List */}
        <div style={{ marginTop: 20 }}>
          {filteredLeads.map((lead) => (
            <div key={lead._id} style={leadCard}>
              
              {/* Left */}
              <div>
                <h3>{lead.name}</h3>
                <p>{lead.email}</p>
                <p><b>Source:</b> {lead.source}</p>

                <p>
                  <b>Status:</b>{" "}
                  <span
                    style={{
                      color:
                        lead.status === "converted"
                          ? "green"
                          : lead.status === "contacted"
                          ? "orange"
                          : "red",
                      fontWeight: "bold",
                    }}
                  >
                    {lead.status}
                  </span>
                </p>

                <p style={{ fontSize: "12px", color: "#555" }}>
                  Created: {new Date(lead.createdAt).toLocaleString()}
                </p>
              </div>

              {/* Right */}
              <div>
                <button onClick={() => updateStatus(lead._id, "contacted")}>
                  Contacted
                </button>

                <button onClick={() => updateStatus(lead._id, "converted")}>
                  Converted
                </button>

                <div style={{ marginTop: 10 }}>
                  <input
                    placeholder="Add note..."
                    value={noteText[lead._id] || ""}
                    onChange={(e) =>
                      setNoteText((prev) => ({
                        ...prev,
                        [lead._id]: e.target.value,
                      }))
                    }
                  />

                  <button onClick={() => addNote(lead._id)}>Add</button>
                </div>

                <ul>
                  {lead.notes?.map((note, i) => (
                    <li key={i}>{note.text}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Styles
const cardStyle = {
  background: "#fff",
  padding: "15px",
  borderRadius: "10px",
  boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
};

const leadCard = {
  background: "#fff",
  padding: "15px",
  marginBottom: "15px",
  borderRadius: "10px",
  display: "flex",
  justifyContent: "space-between",
  boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
};