import { setMessages } from "@/redux/chatSlice";
import axiosInstance from "@/utils/axiosInstant";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
const useGetAllMessages = () => {
  const { selectedUser } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchAllMessage = async () => {
      try {
        const res = await axiosInstance.get(
          `/api/message/all/${selectedUser?._id}`
        );

        if (res.data.success) {
          dispatch(setMessages(res.data.messages));
          //  console.log(res.data.messages);
        }
      } catch (error) {
        console.log(error.data.response.message);
        toast.error(error.data.respomse.message);
      }
    };

    fetchAllMessage();
  }, [selectedUser]);
};

export { useGetAllMessages };
