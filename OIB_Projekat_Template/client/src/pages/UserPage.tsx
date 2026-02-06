import React,{ useEffect,useState } from "react";
import { UserDTO } from "../models/users/UserDTO";

import { IUserAPI } from "../api/users/IUserAPI";
import { Table } from "../components/users/Table";
import { CreateUserDTO } from "../models/users/CreateUserDTO";
import { UpdateUserDTO } from "../models/users/UpdateUserDTO";
import { UserRole } from "../enums/UserRole";
import { useAuth } from "../hooks/useAuthHook";
import { useNavigate } from "react-router-dom";

import { Form } from "../components/users/Form";

export const UserPage: React.FC<{
  userAPI: IUserAPI;
}> = ({ userAPI }) => {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [users, setUsers] = useState<UserDTO[]>([]);
  const [editingUser, setEditingUser] = useState<UserDTO | null>(null);

  // form state
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");

  const refresh = async () => {
    if (!token) return;
    const data = await userAPI.getAllUsers(token);
    setUsers(data);
  };

  useEffect(() => {
    refresh();
  }, [token]);

  const onCreate = async () => {
    if (!token) return;

    const dto: CreateUserDTO = {
      username,
      email,
      password,
      role:role as UserRole,
      firstName,
        lastName
    };

    await userAPI.createUser(token, dto);

    setUsername("");
    setEmail("");
    setPassword("");
    setRole("");
    setFirstName("");
    setLastName("");
    await refresh();
  };

  const onUpdate = async () => {
    if (!token || !editingUser) return;

    const dto: UpdateUserDTO = {
      username,
      email,
      role:role as UserRole,
      firstName,
      lastName,
    };

    await userAPI.updateUser(token, editingUser.id, dto);

    setEditingUser(null);
    setUsername("");
    setEmail("");
    setRole("");
    setFirstName("");
    setLastName("");
    

    await refresh();
  };

  const onDelete = async (id: number) => {
    if (!token) return;
    if (!confirm("Da li si siguran da želiš da obrišeš korisnika?")) return;

    await userAPI.deleteUser(token, id);
    await refresh();
  };

  const onEdit = (u: UserDTO) => {
    setEditingUser(u);
    setUsername(u.username);
    setEmail(u.email);
    setRole(u.role);
    setFirstName(u.firstName ?? ""); // ✅ bitno
    setLastName(u.lastName ?? "");
  };

  return (
    <div style={{ padding: 30 }}>
      <div className="analytics-header-info">
        <h1>Korisnici</h1>
        <div className="analytics-subtitle">
          Upravljanje korisnicima sistema
        </div>
      </div>
    <button
    onClick={() => navigate(-1)}
    style={{
      position: "absolute",
      top: 80,
      right: 20,
      padding: "8px 14px",
      borderRadius: 10,
      border: "none",
      background: "linear-gradient(135deg, #2563eb, #4f46e5)",
      color: "#fff",
      fontWeight: 600,
      cursor: "pointer",
      boxShadow: "0 6px 14px rgba(0,0,0,0.18)",
      transition: "transform 0.15s ease, box-shadow 0.15s ease",
    }}
    onMouseOver={(e) => {
      e.currentTarget.style.transform = "translateY(-1px)";
      e.currentTarget.style.boxShadow = "0 10px 18px rgba(0,0,0,0.22)";
    }}
    onMouseOut={(e) => {
      e.currentTarget.style.transform = "translateY(0)";
      e.currentTarget.style.boxShadow = "0 6px 14px rgba(0,0,0,0.18)";
    }}
  >
    ← Nazad
  </button>
      <Form
        username={username}
        setUsername={setUsername}
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        role={role}
        setRole={setRole}
        firstName={firstName}
        setFirstName={setFirstName}
        lastName={lastName}
        setLastName={setLastName}
        isEditing={!!editingUser}
        onCreate={onCreate}
        onUpdate={onUpdate}
        onCancelEdit={() => setEditingUser(null)}
      />

      <Table
        users={users}
        onEdit={onEdit}
        onDelete={onDelete}
      />

     
    </div>
  );
};