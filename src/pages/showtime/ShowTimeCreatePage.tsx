import { toast } from "sonner";
import * as Yup from "yup";
import showtimeService from "../../services/showtime.service";
import ShowTimeForm from "../../components/showtime/ShowTimeForm";
import { useNavigate, useParams } from "react-router";

// ❌ MOVED FROM HERE (Global scope)

export interface IShowTimeCreateData {
  movieId: string;
  screen: string;
  date: string;
  price: number;
  startTime: string;
  endTime: string;
}

const ShowTimeCreateDTO = Yup.object({
  // ... (Your Yup logic remains the same)
});

const ShowTimeCreatePage = () => {
  // ✅ ADDED HERE (Inside the component)
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  // Move submitForm inside so it has access to 'navigate'
  const submitForm = async (data: IShowTimeCreateData) => {
    try {
      const res = await showtimeService.postRequest("/showtime", data, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res) {
        toast.success("ShowTime Created Successfully", {
          description: "ShowTime has been added to the database",
        });
        // Now navigate will work because it's in scope
        navigate(`/admin/showtime/${data.movieId}`);
      }
    } catch (exception: any) {
      console.log("exception:", exception);
      toast.error("Failed to create showtime");
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex justify-between border-b border-b-gray-400 pb-3">
        <h1 className="text-4xl font-semibold text-teal-900">
          ShowTime Create
        </h1>
      </div>

      <div className="flex">
        <ShowTimeForm submitForm={submitForm} DTO={ShowTimeCreateDTO} id={id} />
      </div>
    </div>
  );
};

export default ShowTimeCreatePage;