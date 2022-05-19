import React, { useContext, useReducer, useState } from "react";
import { Helmet } from "react-helmet-async";
import { toast } from "react-toastify";
import { Store } from "../Store";
import { getError } from "../utils";

const reducer = (state, action) => {
  switch (action.type) {
    case "UPDATE_REQUEST":
      return { ...state, loadingUpdate: true };
    case "UPDATE_SUCCESS":
      return { ...state, loadingUpdate: false };
    case "UPDATE_FAIL":
      return { ...state, loadingUpdate: false };

    default:
      return state;
  }
};

const ProfileScreen = () => {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;
  const [name, setName] = useState(userInfo.name);
  const [email, setEmail] = useState(userInfo.email);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [{ loadingUpdate }, dispatch] = useReducer(reducer, {
    loadingUpdate: false,
  });

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/users/profile", {
        method: "PUT",
        headers: {
          "Content-type": "application/json",
          authorization: `Bearer ${userInfo.token}`,
        },
        body: JSON.stringify({ name, email, password }),
      });
      dispatch({ type: "UPDATE_SUCCESS" });
      const data = await response.json();
      ctxDispatch({ type: "USER_SIGNIN", payload: data });
      localStorage.setItem("userInfo", JSON.stringify(data));
      toast.success("User updated successfully");
    } catch (err) {
      dispatch({ type: "UPDATE_FAIL" });
      toast.error(getError(err));
    }
  };

  return (
    <div className="container small-container">
      <Helmet>
        <title>User Profile</title>
      </Helmet>
      <h1 className="my-3">User Profile</h1>
      <form onSubmit={submitHandler}>
        <div className="mb-3" controlid="name">
          <label htmlFor="name" className="form-label">
            Name
          </label>
          <input
            value={name}
            className="form-control"
            id="name"
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="mb-3" controlid="email">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            value={email}
            className="form-control"
            id="email"
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-3" controlid="password">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            className="form-control"
            id="password"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="mb-3" controlid="confirmPassword">
          <label htmlFor="password" className="form-label">
            Confirm Password
          </label>
          <input
            className="form-control"
            id="confirmPassword"
            type="password"
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <button type="submit" className="btn btn-primary">
            Update
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileScreen;
