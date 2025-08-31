import React, { use, useEffect, useState } from "react";
import { useUserContext } from "../../context/userContext";

const Profile = () => {
  // const [userData
  const { userData } = useUserContext();
  useEffect(() => {
    console.log(userData);
  }, [userData]);
  if (!userData) {
    return (
      <div className="p-6 text-center text-gray-500">
        No user details found.
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition duration-300">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
        👤 User Details
      </h2>

      <div className="space-y-3">
        <div className="flex justify-start border-b pb-2">
          <span className="font-semibold w-1/4 text-gray-600">Username:</span>
          <span className="text-gray-800">{userData.name}</span>
        </div>

        {/* <div className="flex justify-between border-b pb-2">
          <span className="font-semibold text-gray-600">Company:</span>
          <span className="text-gray-800">{userData.company_name}</span>
        </div> */}

        {/* <div className="flex justify-between border-b pb-2">
          <span className="font-semibold text-gray-600">Address:</span>
          <span className="text-gray-800">{userData
.address}</span>
        </div> */}

        {/* <div className="flex justify-between border-b pb-2">
          <span className="font-semibold text-gray-600">City:</span>
          <span className="text-gray-800">{userData
.city}</span>
        </div> */}

        <div className="flex justify-start border-b pb-2">
          <span className="font-semibold w-1/4 text-gray-600">email:</span>
          <span className="text-gray-800">{userData.email}</span>
        </div>

        <div className="flex justify-start border-b pb-2">
          <span className="font-semibold w-1/4 text-gray-600">Role:</span>
          <span className="text-gray-800">{userData.role}</span>
        </div>

        {/* <div className="flex justify-between border-b pb-2">
          <span className="font-semibold text-gray-600">Pincode:</span>
          <span className="text-gray-800">{userData
.pincode}</span>
        </div> */}

        {/* <div className="flex justify-between">
          <span className="font-semibold text-gray-600">Purpose:</span>
          <span className="text-gray-800">{userData
.purpose}</span>
        </div> */}
      </div>
    </div>
  );
};

export default Profile;
