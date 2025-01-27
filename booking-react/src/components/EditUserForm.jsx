import { useState } from "react";

import styles from "./Form.module.css";
import Button from "./Button";

export default function EditUserForm({
  admin,
  user,
  isEditable,
  setIsEditable,
  setUserToEdit,
  setUsers,
  users,
}) {
  const [newUserName, setNewUserName] = useState(user?.userName);
  const [newUserEmail, setNewUserEmail] = useState(user?.email);

  function handleFormSubmit(e) {
    e.preventDefault();

    const newUserData = [
      { propName: "userName", value: newUserName },
      { propName: "email", value: newUserEmail },
    ];

    const updateUserURL = `https://booking-system-2hms.onrender.com/users/${user._id}`;
    const response = fetch(updateUserURL, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${admin.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newUserData),
    });
    response
      .then((response) => response.json())
      .then((data) => {
        const userIndexToReplace = users.findIndex(
          (user) => user._id === data.updatedUser._id
        );
        const newUpdatedUsers = users.toSpliced(
          userIndexToReplace,
          1,
          data.updatedUser
        );
        setUsers(newUpdatedUsers);
        setIsEditable(false);
      })
      .catch((err) => {
        console.log({ err });
      });
  }

  function handleCancel() {
    setIsEditable(false);
    setUserToEdit("");
    setNewUserName();
    setNewUserName();
  }

  if (user) {
    return (
      <div className={styles.formWrapper}>
        <form className={styles.form} onSubmit={handleFormSubmit}>
          <div className={styles.row}>
            <label htmlFor="userName">User Name</label>
            <input
              type="text"
              name="userName"
              required
              id="userName"
              value={newUserName}
              onChange={(e) => setNewUserName(e.target.value)}
            />
          </div>

          <div className={styles.row}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              required
              id="email"
              value={newUserEmail}
              onChange={(e) => setNewUserEmail(e.target.value)}
            />
          </div>

          {isEditable && (
            <>
              <div className={styles.buttonsWrapper}>
                <Button type="submit" text="save" />
                <Button
                  type="button"
                  text="cancel"
                  handleClick={handleCancel}
                />
              </div>
            </>
          )}
        </form>
      </div>
    );
  } else {
    return <></>;
  }
}
