import { setUserProfile } from "@/redux/authSlice";
import { setPosts } from "@/redux/postSlice";
import axiosInstance from "@/utils/axiosInstant";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
const useGetUserProfile = (userId) => {
  const dispatch = useDispatch();
  //const [userProfile, setUserProfile] = useState(null);
  useEffect(() => {
    const fetchAllPost = async () => {
      try {
        const res = await axiosInstance.get(`/api/user/profile/${userId}`);
        //console.log(res.data);

        if (res.data.success) {
          dispatch(setUserProfile(res.data.user));
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchAllPost();
  }, [userId]);
};

export { useGetUserProfile };
