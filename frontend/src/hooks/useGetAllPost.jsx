import { setPosts } from "@/redux/postSlice";
import axiosInstance from "@/utils/axiosInstant";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
const useGetAllPost = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchAllPost = async () => {
      try {
        const res = await axiosInstance.get("/api/post/get-all-post");
        console.log(res.data);

        if (res.data.success) {
          dispatch(setPosts(res.data.posts));
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchAllPost();
  }, []);
};

export { useGetAllPost };
