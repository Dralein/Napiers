import { useState, useEffect } from "react";
import { PropTypes } from "prop-types";
import Button from "../components/Button";
import { getAllUser, deleteUser, updateUser, createUser } from "../api/user";

const Users = ({ userToken, updateTrigger, setUpdateTrigger }) => {
  const [users, setUsers] = useState([]);
  const [editUserId, setEditUserId] = useState(null);
  const [editFirstname, setEditFirstname] = useState("");
  const [editLastname, setEditLastname] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [showAddUserModal, setShowAddUserModal] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getAllUser(userToken);
        setUsers(response);
      } catch (error) {
        console.error("Failed to fetch users", error);
      }
    };

    fetchUsers();
  }, [userToken, updateTrigger]);

  const handleSubmitUser = async (e) => {
    e.preventDefault();
    const response = await createUser(firstname, lastname, email, password);
    setShowAddUserModal(false);
    setUpdateTrigger((prev) => prev + 1);
    if (response.message) {
      setMessage(response.message);
    } else if (response.errors) {
      setMessage(`Errors: ${JSON.stringify(response.errors)}`);
    } else {
      setMessage("An error occurred");
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await deleteUser(userToken, userId);
      setUpdateTrigger((prev) => prev + 1);
    } catch (error) {
      console.error("Failed to delete user", error);
    }
  };

  const handleEditUser = (user) => {
    setEditUserId(user.id);
    setEditFirstname(user.firstname);
    setEditLastname(user.lastname);
    setEditEmail(user.email);
  };

  const handleUpdateUser = async () => {
    try {
      const updatedUser = await updateUser(
        editUserId,
        { firstname: editFirstname, lastname: editLastname, email: editEmail },
        userToken
      );
      setUsers(
        users.map((user) => (user.id === editUserId ? updatedUser : user))
      );
      setEditUserId(null);
      setEditFirstname("");
      setEditLastname("");
      setEditEmail("");
      setUpdateTrigger((prev) => prev + 1);
    } catch (error) {
      console.error("Failed to update user", error);
    }
  };

  return (
    <div className="users">
      <Button
        text="Add"
        className={"button"}
        onClick={() => setShowAddUserModal(true)}
      />
      <div className="users-list">
        {users.map((user) => (
          <div key={user.id} className="user-card">
            {editUserId === user.id ? (
              <div className="edit-form">
                <label>
                  First Name:
                  <input
                    type="text"
                    value={editFirstname}
                    onChange={(e) => setEditFirstname(e.target.value)}
                    required
                  />
                </label>
                <label>
                  Last Name:
                  <input
                    type="text"
                    value={editLastname}
                    onChange={(e) => setEditLastname(e.target.value)}
                    required
                  />
                </label>
                <label>
                  Email:
                  <input
                    type="email"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    required
                  />
                </label>
                <div className="buttonflex">
                <Button
                  text="Save"
                  className={"button"}
                  onClick={handleUpdateUser}
                />
                <Button
                  text="Cancel"
                  className={"button"}
                  onClick={() => setEditUserId(null)}
                />
                </div>
              </div>
            ) : (
              <>
                <p>First Name: {user.firstname}</p>
                <p>Last Name: {user.lastname}</p>
                <p className="textwrapusers">Email: {user.email}</p>
                <div className="buttonflex">
                <Button
                  text="Update"
                  className={"button"}
                  onClick={() => handleEditUser(user)}
                />
                <Button
                  text="Delete"
                  className={"button"}
                  onClick={() => handleDeleteUser(user.id)}
                />
                </div>
              </>
            )}
          </div>
        ))}
      </div>
      {showAddUserModal && (
        <div className="modal">
          <div className="modal-content">
            <form className="formlogin" onSubmit={handleSubmitUser}>
              <div className="flexformname">
                <div className="input-wrapper">
                  <label htmlFor="First name">First name</label>
                  <input
                    className="forminput"
                    type="text"
                    placeholder="First name"
                    id="First name"
                    value={firstname}
                    onChange={(e) => setFirstname(e.target.value)}
                    required
                  />
                </div>
                <div className="input-wrapper">
                  <label htmlFor="Last name">Last name</label>
                  <input
                    className="forminput"
                    type="text"
                    placeholder="Last name"
                    id="Last name"
                    value={lastname}
                    onChange={(e) => setLastname(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="input-wrapper">
                <label htmlFor="email">Email</label>
                <input
                  className="forminput"
                  placeholder="Your email address"
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="input-wrapper">
                <label htmlFor="password">Password</label>
                <input
                  className="forminput"
                  type="password"
                  placeholder="Your password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="buttoncenter">
              <Button text="Save" className={"button"} />
              <Button
                text="Cancel"
                className={"button"}
                onClick={() => setShowAddUserModal(false)}
              />
              </div>
              {message && <p>{message}</p>}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

Users.propTypes = {
  userToken: PropTypes.string.isRequired,
  updateTrigger: PropTypes.number.isRequired,
  setUpdateTrigger: PropTypes.func.isRequired,
};

export default Users;
