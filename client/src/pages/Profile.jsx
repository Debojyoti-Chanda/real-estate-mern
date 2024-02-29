import React, { useRef, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  getStorage,
  uploadBytesResumable,
  ref,
  getDownloadURL,
} from "firebase/storage";
import { app } from "../firebase";
const Profile = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [filePer, setFilePer] = useState(0);
  const [formData, setFormData] = useState({});

  // console.log(fileUploadError);
  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

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
  const fileRef = useRef();
  return (
    <>
      <h1 className="text-2xl font-semibold text-center my-7">Profile</h1>
      <form className="flex flex-col justify-center items-center gap-5">
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
          <span className="text-red-600">Error Image upload (image must be less than 2 mb)</span>
        ) : filePer > 0 && filePer < 100 ? (
          <span className="text-green-600">{`Image Uploading ${filePer} %....`}</span>
        ) : filePer === 100 ?  (
          <span className="text-green-600">Image Uploaded Sucessfully</span>
        ) : ''}
        <input
          type="text"
          name="username"
          id="username"
          placeholder="Username"
          className="border p-3 rounded-xl  md:w-2/4"
        />
        <input
          type="email"
          name="email"
          id="email"
          placeholder="Email"
          className="border p-3 rounded-xl  md:w-2/4"
        />
        <input
          type="password"
          name="password"
          id="password"
          placeholder="Password"
          className="border p-3 rounded-xl  md:w-2/4"
        />
        <button className="bg-slate-200 w-1/4 p-2 rounded-2xl hover:bg-slate-500 hover:text-white">
          Update
        </button>
      </form>
      <div className="flex flex-row justify-between items-center w-2/4 mx-auto mt-4 md:mt-8">
        <span className="text-red-700 cursor-pointer"> Delete Account</span>
        <span className="text-red-700 cursor-pointer">Sign Out</span>
      </div>
    </>
  );
};

export default Profile;
