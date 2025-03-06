import { setSuggestedUser } from "@/redux/authSlice";
import axiosInstance from "@/utils/axiosInstant";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
const useGetAllSuggestedUsers = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchSuggestedUser = async () => {
      try {
        const res = await axiosInstance.get("/api/user/suggested");
        console.log(res.data);

        if (res.data.success) {
          dispatch(setSuggestedUser(res.data.users));
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchSuggestedUser();
  }, []);
};

export { useGetAllSuggestedUsers };
