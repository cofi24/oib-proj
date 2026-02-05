

import { UserDTO } from "../../models/users/UserDTO";

type Props = {
  users: UserDTO[];
  onEdit: (u: UserDTO) => void;
  onDelete: (id: number) => void;
};

export const Table: React.FC<Props> = ({
  users,
  onEdit,
  onDelete,
}) => {
  return (
    <table width="100%">
      <thead>
        <tr>
          <th>ID</th>
          <th>Username</th>
          <th>Email</th>
          <th>Role</th>
          <th>Akcije</th>
        </tr>
      </thead>

      <tbody>
        {users.map((u) => (
          <tr key={u.id}>
            <td>{u.id}</td>
            <td>{u.username}</td>
            <td>{u.email}</td>
            <td>{u.role}</td>
            <td>
              <button onClick={() => onEdit(u)}>✏️</button>
              <button onClick={() => onDelete(u.id)}>🗑</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};