import React, { useState } from "react";
import { app } from "../firebase";
import {
  getStorage,
  uploadBytesResumable,
  ref,
  getDownloadURL,
} from "firebase/storage";

const CreateListing = () => {
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({ imageURL: [] });
  const [imageUploadError, setImageUploadError] = useState("");
  const [uploading, setUploading] = useState(false);

  console.log(formData);

  const imageUploadHandler = (evt) => {
    if (files.length > 0 && files.length + formData.imageURL.length < 6) {
      setUploading(true);
      const promises = [];
      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }
      Promise.all(promises)
        .then((urls) => {
          setFormData((prevData) => {
            return { ...prevData, imageURL: prevData.imageURL.concat(urls) };
          });
          setUploading(false);
          setImageUploadError("");
        })
        .catch((err) => {
          setImageUploadError("Each Image Should be < 2MB");
          setUploading(false);
          console.log(err);
        });
    } else {
      setUploading(false);
      setImageUploadError("Number of Images  should be < 6");
    }
  };

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
        },
        (err) => {
          reject(err);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
            resolve(downloadURL)
          );
        }
      );
    });
  };

  const handleRemoveImage = (i) => {
    setFormData((prevData) => {
      return {
        ...prevData,
        imageURL: prevData.imageURL.filter((_, index) => i !== index ),
      };
    });
  };
  return (
    <main className="p-4 mx-auto">
      <h1 className="text-3xl font-semibold text-center mt-6">
        Create a Listing
      </h1>
      <form className="flex flex-col md:flex-row justify-center items-center gap-6">
        {/* Box1 1 */}
        <div className="flex flex-col flex-1 justify-center ">
          {/* name field */}
          <input
            type="text"
            placeholder="Name"
            id="name"
            name="name"
            maxLength={62}
            required
            className="border p-3 rounded-xl bg-slate-300 mt-8 "
          />
          {/* Description Field */}
          <textarea
            type="text"
            placeholder="Description"
            id="description"
            name="description"
            required
            className="border p-3 rounded-xl bg-slate-300 mt-4 "
          ></textarea>
          {/* Address */}
          <input
            type="text"
            placeholder="Address"
            id="address"
            name="address"
            required
            className="border p-3 rounded-xl bg-slate-300 mt-4 "
          />

          {/* Checkboxes*/}
          <div className="flex gap-6 flex-wrap  my-4 justify-center items-center">
            <div className="flex gap-2">
              <input type="checkbox" id="sale" className="w-5 " />
              <span>Sell</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="rent" className="w-5 " />
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="parking" className="w-5 " />
              <span>Parking Spot</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="furnished" className="w-5 " />
              <span>Furnished</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="offer" className="w-5 " />
              <span>Offer</span>
            </div>
          </div>

          {/* Beds, Baths and Regular Price */}
          <div className="flex gap-6 flex-wrap justify-center items-center ">
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bedrooms"
                min="1"
                max="10"
                required=""
                className="p-2  border border-gray-300 rounded-lg"
              />
              <p>Beds</p>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bathrooms"
                min="1"
                max="10"
                required=""
                className="p-2 border border-gray-300 rounded-lg"
              />
              <p>Baths</p>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="number"
                id="regularPrice"
                min="50"
                max="10000000"
                required=""
                className="p-2 border border-gray-300 rounded-lg"
              />
              <div className="flex flex-col items-center">
                <p>Regular price </p>
                <span className="text-xs">($ / Month)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Box 2 */}
        <div className="flex flex-col flex-1 gap-4">
          <p className="font-semibold">
            Images :
            <span className="text-gray-600 font-normal">
              The first image will be the cover (max 6)
            </span>
          </p>

          <input
            type="file"
            id="images"
            accept="image/*"
            multiple
            className="p-3 border border-gray-300 rounded w-full"
            onChange={(evt) => setFiles(evt.target.files)}
          />
          <button
            className="p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80"
            onClick={imageUploadHandler}
            disabled={uploading}
            type="button"
          >
            { uploading ? 'Loading...' : 'Upload'}
          </button>

          <p className="text-red-700">
            {imageUploadError === "" ? "" : imageUploadError}
          </p>
          {formData.imageURL.map((url, index) => {
            return (
              <div
                key={url}
                className="flex justify-between p-3 items-center border"
              >
                <img
                  src={url}
                  alt="listing image"
                  className="text-white rounded-xl object-cover w-40 h-40"
                />
                <button
                  className="text-red-600 uppercase hover:font-bold"
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                >
                  Delete
                </button>
              </div>
            );
          })}
          <button
            type="submit"
            className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
          >
            Create Listing
          </button>
        </div>
      </form>
    </main>
  );
};

export default CreateListing;
