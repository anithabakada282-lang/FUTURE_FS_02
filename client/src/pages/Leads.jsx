import React, { useEffect, useState } from "react";

const Leads = () => {
  const [leads, setLeads] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/leads")
      .then((res) => res.json())
      .then((data) => {
        console.log("Leads:", data);
        setLeads(data);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Leads Page</h1>

      {leads.length === 0 ? (
        <p>No leads yet</p>
      ) : (
        leads.map((lead, index) => (
          <div key={index} style={{ marginBottom: "15px" }}>
            <p><strong>Name:</strong> {lead.name}</p>
            <p><strong>Email:</strong> {lead.email}</p>
            <p><strong>Status:</strong> {lead.status}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default Leads;