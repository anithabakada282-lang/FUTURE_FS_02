import { useState } from "react";
import API from "../services/api";

export default function AddLead() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    source: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    await API.post("/leads", form);

    alert("Lead added!");
    setForm({ name: "", email: "", source: "" });
  };

  return (
    <div>
      <h3>Add Lead</h3>

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          placeholder="Source"
          value={form.source}
          onChange={(e) => setForm({ ...form, source: e.target.value })}
        />

        <button type="submit">Add Lead</button>
      </form>
    </div>
  );
}