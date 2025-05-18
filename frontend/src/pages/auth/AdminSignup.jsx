import React from "react";

const AdminSignup = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 shadow-lg rounded-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-6 text-center">Admin Sign Up</h2>
        <form>
          <input type="text" placeholder="Full Name" className="w-full mb-4 p-2 border rounded" />
          <input type="email" placeholder="Email" className="w-full mb-4 p-2 border rounded" />
          <input type="password" placeholder="Password" className="w-full mb-4 p-2 border rounded" />
          <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">Sign Up</button>
        </form>
      </div>
    </div>
  );
};

export default AdminSignup;
