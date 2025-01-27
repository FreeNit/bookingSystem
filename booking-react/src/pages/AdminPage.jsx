import { useEffect, useState } from "react";

import EditUserForm from "../components/EditUserForm";

import styles from "../components/Adminpage.module.css";

export default function Adminpage({ user }) {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState();
  const [isEditable, setIsEditable] = useState(false);
  const [userToEdit, setUserToEdit] = useState();

  // -> Retrieve all users
  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);

      const response = await fetch(
        "https://booking-system-2hms.onrender.com/users",
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      setUsers(data.users);

      setIsLoading(false);
    };

    fetchUsers();
  }, []);

  function handleDeleteUser(userId) {
    const response = fetch(
      `https://booking-system-2hms.onrender.com/users/${userId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "application/json",
        },
      }
    );

    response
      .then((result) => {
        if (result.status === 200 && result.ok) {
          setUsers((users) => users.filter((user) => user._id !== userId));
        }
      })
      .catch((err) => console.log(err));
  }

  function handleEditUser(userToEdit) {
    setIsEditable(true);
    setUserToEdit(userToEdit);
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.usersWrapper}>
      <div>
        <h3 className={styles.listHeader}>List of Users</h3>
        <ul className={styles.usersList}>
          {users
            .sort((a, b) => {
              if (a.userType < b.userType) return -1;
            })
            .map((user) => {
              return (
                <li
                  className={
                    styles.userItemWrapper +
                    " " +
                    (user.userType === "admin" ? styles.userItemAdmin : "")
                  }
                  key={user._id}
                >
                  <span>
                    <b>User Name: </b>
                    {user.userName}
                  </span>
                  <span>
                    <b>User Type: </b>
                    {user.userType}
                  </span>
                  <span>
                    <b>User Email:</b> {user.email}
                  </span>
                  {!isEditable && (
                    <div className={styles.itemsModification}>
                      <span onClick={() => handleEditUser(user)}>🖋</span>
                      <span onClick={() => handleDeleteUser(user._id)}>❌</span>
                    </div>
                  )}
                </li>
              );
            })}
        </ul>
      </div>
      <div>
        {userToEdit && isEditable && (
          <EditUserForm
            admin={user}
            user={userToEdit}
            isEditable={isEditable}
            setIsEditable={setIsEditable}
            setUserToEdit={setUserToEdit}
            setUsers={setUsers}
            users={users}
          />
        )}
      </div>
    </div>
  );
}
