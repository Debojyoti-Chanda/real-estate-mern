import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (evt) => {
    console.log(formData);
    setFormData((prevdata) => {
      return { ...prevdata, [evt.target.id]: evt.target.value };
    });
  };

  const submitHandler = (evt) => {
    evt.preventDefault();
    setLoading(true);
    fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        console.log(response);
        if (response.status === 404) {
          throw new Error("Page not Found");
        }
        return response.json();
      })
      .then((data) => {
        setFormData({
          username: "",
          email: "",
          password: "",
        });
        console.log(data);
        setError(null)
        if (data.success === false) {
          setLoading(false);
          setError(data.errMessage);
          return
        }
        setLoading(false);
        navigate("/login")
      })
      .catch((err) => {
        setFormData({
          username: "",
          email: "",
          password: "",
        });
        setLoading(false);
        setError(err.message);
        console.error("Error occurred while signing up in Catch block:", err);
      });
  };

  return (
    <>
      <section className="bg-gray-300">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <a
            href="#"
            className="flex items-center mb-6 text-2xl font-semibold text-gray-950"
          >
            Sign-Up
          </a>
          <div className="w-full  rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 bg-gray-600 border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight md:text-2xl text-white">
                Create and account
              </h1>
              {/* form  */}
              <form className="space-y-4 md:space-y-6" onSubmit={submitHandler}>
                <div>
                  <label
                    htmlFor="username"
                    className="block mb-2 text-sm font-medium text-white"
                  >
                    Your Username
                  </label>
                  <input
                    type="text"
                    name="username"
                    id="username"
                    className="border   sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Username"
                    required=""
                    onChange={handleChange}
                    value={formData.username}
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block mb-2 text-sm font-medium text-white"
                  >
                    Your email
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    className="border sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
                    placeholder="name@company.com"
                    required=""
                    onChange={handleChange}
                    value={formData.email}
                  />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block mb-2 text-sm font-medium text-white"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    placeholder="••••••••"
                    className="border sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
                    required=""
                    onChange={handleChange}
                    value={formData.password}
                  />
                </div>

                <button
                  disabled={loading}
                  type="submit"
                  className="w-full text-white bg-primary-600 hover:bg-slate-900 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                >
                  {loading ? "Loading...." : "Create an account"}
                </button>
              </form>

              <p className="text-sm font-light text-gray-200">
                Already have an account?{" "}
                <Link
                  to={"/login"}
                  className="font-medium hover:underline text-primary-500"
                >
                  Login here
                </Link>
              </p>
            </div>
          </div>
          <div hidden={error ? false : true} className="text-red-500">{error}</div>
        </div>
      </section>
    </>
  );
};

export default Signup;
