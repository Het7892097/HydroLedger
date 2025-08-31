import React, { useEffect, useState } from "react"; 


const Profile = () => {
  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    const storedDetails = localStorage.getItem("UserDetails");
    if (storedDetails) {
      setUserDetails(JSON.parse(storedDetails));
    }
  }, []);

  if (!userDetails) {
    
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
        <div className="flex justify-between border-b pb-2">
          <span className="font-semibold text-gray-600">Username:</span>
          <span className="text-gray-800">{userDetails.username}</span>
        </div>

        <div className="flex justify-between border-b pb-2">
          <span className="font-semibold text-gray-600">Company:</span>
          <span className="text-gray-800">{userDetails.company_name}</span>
        </div>

        <div className="flex justify-between border-b pb-2">
          <span className="font-semibold text-gray-600">Address:</span>
          <span className="text-gray-800">{userDetails.address}</span>
        </div>

        <div className="flex justify-between border-b pb-2">
          <span className="font-semibold text-gray-600">City:</span>
          <span className="text-gray-800">{userDetails.city}</span>
        </div>

        <div className="flex justify-between border-b pb-2">
          <span className="font-semibold text-gray-600">State:</span>
          <span className="text-gray-800">{userDetails.state}</span>
        </div>

        <div className="flex justify-between border-b pb-2">
          <span className="font-semibold text-gray-600">Country:</span>
          <span className="text-gray-800">{userDetails.country}</span>
        </div>

        <div className="flex justify-between border-b pb-2">
          <span className="font-semibold text-gray-600">Pincode:</span>
          <span className="text-gray-800">{userDetails.pincode}</span>
        </div>

        <div className="flex justify-between">
          <span className="font-semibold text-gray-600">Purpose:</span>
          <span className="text-gray-800">{userDetails.purpose}</span>
        </div>
      </div>
    </div>
  );
};

export default Profile;
