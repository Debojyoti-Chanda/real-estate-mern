import React, { useRef, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getStorage,
  uploadBytesResumable,
  ref,
  getDownloadURL,
} from "firebase/storage";
import { Link, useNavigate } from "react-router-dom";
import { app } from "../firebase";

import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserStart,
  deleteUserFailure,
  deleteUserSuccess,
  logoutUserStart,
  logoutUserFailure,
  logoutUserSuccess,
} from "../redux/user/userSlice";

const Profile = () => {
  const { currentUser, loading, error } = useSelector((state) => state.user);

  const [file, setFile] = useState(undefined);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [filePer, setFilePer] = useState(0);
  const [formData, setFormData] = useState({
    username: currentUser.username,
    email: currentUser.email,
  });
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [listingError, setListingError] = useState(null);
  const [listData, setListData] = useState([]);

  const dispatch = useDispatch();
  const fileRef = useRef();

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  /**
   * @description handles file upload
   * @param {*} file
   */
  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        // console.log("Upload is " + progress + "% done");
        setFilePer(Math.round(progress));
      },
      (err) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData((prevFormData) => {
            const newFormData = { ...prevFormData, avatar: downloadURL };
            // console.log(newFormData);
            return newFormData;
          })
        );
      }
    );
  };

  // console.log(formData);
  const onChangeHandler = (evt) => {
    setFormData((prevData) => {
      return { ...prevData, [evt.target.id]: evt.target.value };
    });
  };

  const submitHandler = (evt) => {
    evt.preventDefault();
    dispatch(updateUserStart());
    fetch(`/api/user/update/${currentUser._id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        if (response.status === 404) {
          if (!response.url.endsWith(`/api/user/update/${currentUser._id}`)) {
            throw new Error("Page not Found");
          } else {
            throw new Error("User Not Found");
          }
        }
        return response.json();
      })
      .then((data) => {
        setFormData({
          username: currentUser.username,
          email: currentUser.email,
        });

        if (data.success === false) {
          dispatch(updateUserFailure(data.errMessage));
          return;
        }
        dispatch(updateUserSuccess(data));
        setUpdateSuccess(true);
      })
      .catch((err) => {
        setFormData({
          username: currentUser.username,
          email: currentUser.email,
        });
        dispatch(updateUserFailure(err.message));
        console.log("Error occurred while Updating in Catch block:", err);
      });
  };

  const deleteHandler = (evt) => {
    dispatch(deleteUserStart());
    fetch(`/api/user/delete/${currentUser._id}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (res.status === 404) {
          if (!res.url.endsWith(`/api/user/delete/${currentUser._id}`)) {
            throw new Error("Page not Found");
          } else {
            throw new Error("User Not Found");
          }
        }
        return res.json();
      })
      .then((data) => {
        if (data.success === false) {
          dispatch(deleteUserFailure(data.errMessage));
          return;
        }
        dispatch(deleteUserSuccess(data));
      })
      .catch((err) => {
        dispatch(deleteUserFailure(err.message));
        console.log("Error occurred while Updating in Catch block:", err);
      });
  };

  const logoutHandler = (evt) => {
    logoutUserStart();
    fetch("/api/auth/logout")
      .then((res) => {
        if (res.status === 404) {
          if (!res.url.endsWith("/api/auth/logout")) {
            throw new Error("Page not Found");
          } else {
            throw new Error("User Not Found");
          }
        }
        return res.json();
      })
      .then((data) => {
        if (data.success === false) {
          dispatch(logoutUserFailureUserFailure(data.errMessage));
          return;
        }
        dispatch(logoutUserSuccess(data));
      })
      .catch((err) => {
        dispatch(logoutUserFailure(err.message));
        console.log("Error occurred while Updating in Catch block:", err);
      });
  };

  const showListingHandler = (evt) => {
    setListingError(false);
    fetch(`/api/listing/listings/${currentUser._id}`)
      .then((response) => {
        return response.json();
      })
      .then((lists) => {
        if (lists.success === false) {
          setListingError(true);
          return;
        }
        setListData(lists);
      })
      .catch((err) => {
        setListingError(true);
      });
  };

  const deleteListHandler = (evt, listId) => {
    fetch(`/api/listing/delete/${listId}`, {
      method: "DELETE",
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        if (data.success === false) {
          console.log(data.message);
          return;
        }
        setListData((prevLists) =>
          prevLists.filter((list) => list._id !== listId)
        );
      })
      .catch((err) => {
        console.log("Error while deleting the list");
      });
  };

  return (
    <>
      <h1 className="text-2xl font-semibold text-center my-7">Profile</h1>
      <form
        className="flex flex-col justify-center items-center gap-5"
        onSubmit={submitHandler}
      >
        <input
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
          onChange={(evt) => setFile(evt.target.files[0])}
        />
        <img
          src={formData.avatar || currentUser.avatar}
          alt="Profile Picture"
          className="w-24 h-24 rounded-full object-cover cursor-pointer"
          onClick={() => fileRef.current.click()}
        />
        {fileUploadError ? (
          <span className="text-red-600">
            Error Image upload (image must be less than 2 mb)
          </span>
        ) : filePer > 0 && filePer < 100 ? (
          <span className="text-green-600">{`Image Uploading ${filePer} %....`}</span>
        ) : filePer === 100 ? (
          <span className="text-green-600">Image Uploaded Sucessfully</span>
        ) : (
          ""
        )}
        <input
          type="text"
          name="username"
          id="username"
          placeholder="Username"
          className="border p-3 rounded-xl  md:w-2/4"
          defaultValue={currentUser.username}
          onChange={onChangeHandler}
        />
        <input
          type="email"
          name="email"
          id="email"
          placeholder="Email"
          className="border p-3 rounded-xl  md:w-2/4"
          defaultValue={currentUser.email}
          onChange={onChangeHandler}
        />
        <input
          type="password"
          name="password"
          id="password"
          placeholder="Password"
          className="border p-3 rounded-xl  md:w-2/4"
          onChange={onChangeHandler}
        />
        <button
          disabled={loading}
          className="bg-slate-300 w-1/4 p-2 rounded-2xl hover:bg-slate-500 hover:text-white"
        >
          {loading ? "Loading..." : "Update"}
        </button>
        <Link
          to={"/create-listing"}
          className="bg-slate-300 w-1/4 p-2 rounded-2xl hover:bg-slate-500 hover:text-white text-center"
        >
          Create Listing
        </Link>
      </form>
      <div className="flex flex-row justify-between items-center w-2/4 mx-auto mt-4 md:mt-8">
        <span className="text-red-700 cursor-pointer" onClick={deleteHandler}>
          {" "}
          Delete Account
        </span>
        <span className="text-red-700 cursor-pointer" onClick={logoutHandler}>
          Sign Out
        </span>
      </div>
      <p className="text-red-700 mt-4 text-center">{error ? error : ""}</p>
      <p className="text-green-700 mt-4 text-center">
        {updateSuccess ? "User Updated Successfully" : ""}
      </p>

      <div className="flex flex-col justify-between items-center m-4">
        <span
          className="text-green-700 cursor-pointer"
          onClick={showListingHandler}
        >
          Show Listings
        </span>
        <p hidden={!listingError} className="text-red-700 m-4">
          Error During Show Listings
        </p>
        <div className="sm:w-3/5">
          {listData.length > 0 && (
            <div>
              <h3 className="font-semibold text-center text-2xl my-7">
                Your Listings
              </h3>
              {listData.map((list) => {
                return (
                  <div
                    key={list._id}
                    className="flex flex-row justify-between items-center border m-2 rounded-lg"
                  >
                    <Link
                      to={`/listing/${list._id}`}
                      className="flex flex-row justify-between items-center"
                    >
                      <img
                        src={list.imageURL[0]}
                        alt="Property Image"
                        className="h-24 w-24 m-2 object-contain "
                      />

                      <div className="m-2 font-semibold hover:underline">
                        {list.name}{" "}
                      </div>
                    </Link>
                    <div className=" flex flex-col gap-3 m-2">
                      <Link to={`/edit-listing/${list._id}`}>
                        <button className="text-green-700">Edit</button>
                      </Link>
                      <button
                        onClick={(evt) => deleteListHandler(evt, list._id)}
                        className="text-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Profile;
