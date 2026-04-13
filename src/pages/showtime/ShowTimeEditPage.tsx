import * as Yup from "yup";
import { useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Spin } from "antd";
import showtimeService from "../../services/showtime.service";
import ShowTimeForm from "../../components/showtime/ShowTimeForm";

const ShowTimeEditDTO = Yup.object({
  movieId: Yup.string().optional(),
  screen: Yup.string().oneOf(["SCREEN1", "SCREEN2", "SCREEN3"], "Invalid Screen").required(),
  price: Yup.number().typeError("Price must be a number").positive("Price must be positive").required("Price is required"),
  date: Yup.date().required("Date is required"),
  startTime: Yup.string()
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Start time must be HH:mm")
    .required(),
  endTime: Yup.string()
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "End time must be HH:mm")
    .required(),
});

const ShowTimeEditPage = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [loading, setLoading] = useState<boolean>(true);
  const [showTimeDetail, setShowTimeDetail] = useState<any>();

  const submitForm = async (data: any) => {
    try {
        const res:any = await showtimeService.getRequest(`/showtime/getshowtime/${params.id}`)
        
      const payload = {
        screen: data.screen,
        price: Number(data.price),
        date: data.date,
        startTime: data.startTime,
        endTime: data.endTime,
        movieId: res.data.movieId
      };

      console.log("Sending Payload:", payload);

      await showtimeService.putRequest(`/showtime/${params.id}`, payload);

      toast.success("Successfully updated!!", {
        description: "ShowTime updated successfully",
      });
      navigate("/admin");
    } catch (exception: any) {
      console.error("Submit Error:", exception);
      
      const serverError = exception.response?.data?.error;
      const errorMessage = exception.response?.data?.message || "Check console for details";

      toast.error("Update Failed", {
        description: typeof serverError === 'string' ? serverError : errorMessage,
      });
    }
  };

  const getShowTimeDetail = async () => {
    try {
      const response = await showtimeService.getRequest(`/showtime/${params.id}`);
      
      const movieFieldValue = typeof response.data.movieId === 'object' 
        ? response.data.movieId._id 
        : response.data.movieId;

      const formattedData = {
        ...response.data,
        movieId: movieFieldValue,
        date: response.data.date ? new Date(response.data.date).toISOString().split("T")[0] : "",
      };
      
      setShowTimeDetail(formattedData);
    } catch (error) {
      toast.error("Error!", {
        description: "Error while fetching showtime data...",
      });
      navigate("/admin/showtime");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (params.id) getShowTimeDetail();
  }, [params.id]);

  return (
    <div className="flex flex-col gap-5 p-6">
      <div className="flex justify-between border-b border-b-gray-400 pb-3">
        <h1 className="text-4xl font-semibold text-teal-900">ShowTime Edit</h1>
      </div>
      
      <div className="flex flex-col">
        {loading ? (
          <div className="flex h-96 w-full justify-center items-center">
            <Spin size="large" />
          </div>
        ) : (
          <ShowTimeForm
            submitForm={submitForm}
            DTO={ShowTimeEditDTO}
            showTimeDetail={showTimeDetail}
          />
        )}
      </div>
    </div>
  );
};

export default ShowTimeEditPage;