import React, { useEffect, useState } from "react";
import { useAppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets";
import toast from "react-hot-toast";

// Simple spinning loader
const Loader = () => (
  <div className="w-full h-32 flex items-center justify-center mt-10">
    <div className="w-12 h-12 border-4 border-gray-300 border-t-primary rounded-full animate-spin" />
  </div>
);

const UserDetails = () => {
  const { user, navigate, axios: axiosInstance } = useAppContext();
  const [fullUser, setFullUser] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeoutReached, setTimeoutReached] = useState(false);

  // Fetch user info
  const getUserInfo = async () => {
    try {
      if (!user) return;

      const { data } = await axiosInstance.post("/api/user/is-auth", { userId: user._id });
      if (data.success) setFullUser(data.user);
      else toast.error(data.message);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch user addresses
  const getUserAddresses = async () => {
    try {
      if (!user) return;

      const { data } = await axiosInstance.post("/api/address/get", { userId: user._id });
      if (data.success) setAddresses(data.addresses);
      else toast.error(data.message);
    } catch (err) {
      toast.error(err.message);
    }
  };

  useEffect(() => {
    // 10-second timer before redirect
    const timer = setTimeout(() => setTimeoutReached(true), 10000);

    if (user) {
      getUserInfo();
      getUserAddresses();
    }

    return () => clearTimeout(timer);
  }, [user]);

  // Redirect to login only if timeout reached and user is undefined
  useEffect(() => {
    if (timeoutReached && !user) navigate("/login");
  }, [timeoutReached, user, navigate]);

  // Show loader while fetching
  if (loading || !user) return <Loader />;

  if (!fullUser) return <p className="text-center mt-10">No user found.</p>;

  return (
    <div className="mt-16 px-4 md:px-10">
      <h1 className="text-2xl md:text-3xl font-semibold text-gray-700 mb-8">
        My Account
      </h1>

      {/* User Info */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <div className="flex items-center gap-4">
          <img
            src={fullUser.avatar || assets.profile_icon}
            alt="User Avatar"
            className="w-20 h-20 rounded-full object-cover border"
          />
          <div>
            <h2 className="text-lg font-medium">{fullUser.name}</h2>
            <p className="text-gray-500">{fullUser.email}</p>
            {fullUser.phone && <p className="text-gray-500">{fullUser.phone}</p>}
          </div>
        </div>

        <button
          onClick={() => navigate("/edit-account")}
          className="mt-4 px-6 py-2 bg-primary text-white rounded-md hover:bg-primary-dull transition"
        >
          Edit Profile
        </button>
      </div>

      {/* Addresses */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-lg font-medium mb-4">Saved Addresses</h2>
        {addresses.length === 0 ? (
          <p className="text-gray-500 mb-4">No saved addresses.</p>
        ) : (
          <div className="space-y-4">
            {addresses.map((addr, index) => (
              <div
                key={index}
                className="border border-gray-300 rounded-md p-3 flex justify-between items-center"
              >
                <div className="text-gray-700 text-sm">
                  <p>{addr.firstName} {addr.lastName}</p>
                  <p>{addr.street}, {addr.city}, {addr.state}, {addr.country} - {addr.zipcode}</p>
                  <p>{addr.phone}</p>
                </div>
                <button
                  onClick={() => navigate("/edit-address", { state: { address: addr } })}
                  className="text-primary font-medium hover:underline"
                >
                  Edit
                </button>
              </div>
            ))}
          </div>
        )}
        <button
          onClick={() => navigate("/add-address")}
          className="mt-4 px-6 py-2 bg-primary text-white rounded-md hover:bg-primary-dull transition"
        >
          Add New Address
        </button>
      </div>
    </div>
  );
};

export default UserDetails;
