import React, { useRef, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getStorage,
  uploadBytesResumable,
  ref,
  getDownloadURL,
} from "firebase/storage";
import { useNavigate } from "react-router-dom";
import { app } from "../firebase";

import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserStart,
  deleteUserFailure,
  deleteUserSuccess,
} from "../redux/user/userSlice";

const Profile = () => {
  const { currentUser, loading, error } = useSelector((state) => state.user);
  
  const [file, setFile] = useState(undefined);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [filePer, setFilePer] = useState(0);
  const [formData, setFormData] = useState({ username: currentUser.username, email: currentUser.email });
  const [updateSuccess, setUpdateSuccess] = useState(false);

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
          if (!response.url.endsWith("/api/user/update")) {
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
    }).then(res => {
      if (res.status === 404) {
        if (!res.url.endsWith("/api/user/update")) {
          throw new Error("Page not Found");
        } else {
          throw new Error("User Not Found");
        }
      }
      return res.json();
    }).then(data => {
      if (data.success === false) {
        dispatch(deleteUserFailure(data.errMessage));
        return;
      }
      dispatch(deleteUserSuccess(data));
    }).catch(err => {
      dispatch(deleteUserFailure(err.message));
      console.log("Error occurred while Updating in Catch block:", err);
    })
  }

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
        <button disabled={loading} className="bg-slate-200 w-1/4 p-2 rounded-2xl hover:bg-slate-500 hover:text-white">
          { loading ? 'Loading...' : 'Update'}
        </button>
      </form>
      <div className="flex flex-row justify-between items-center w-2/4 mx-auto mt-4 md:mt-8">
        <span className="text-red-700 cursor-pointer" onClick={deleteHandler}> Delete Account</span>
        <span className="text-red-700 cursor-pointer">Sign Out</span>
      </div>
      <p className="text-red-700 mt-4 text-center">{error ? error : ''}</p>
      <p className="text-green-700 mt-4 text-center">{updateSuccess ? 'User Updated Successfully' : ''}</p>
    </>
  );
};

export default Profile;
