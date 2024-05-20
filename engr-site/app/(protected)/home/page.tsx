//* home page when users first log in
// "use client";
import "@mantine/core/styles.css";
import { SearchButton } from "@/components/mantine";
import Link from "next/link";
import "./page.css";
import requireAuth from "@/actions/auth/requireAuth";

const Home = async () => {
  await requireAuth();

  return (
    <div>
      <div
        className="banner"
        style={{
          width: "100%",
          height: "400px",
          backgroundImage: 'url("/banner.jpg")',
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      ></div>

      <div className="searchButtonContainer">
        <div className="shorterWidth">
          <SearchButton />
          <p>
            The site has engineering teaching resources for several courses and
            all sources are tagged by the concepts they are related to. For
            example, this site has strength of materials content about normal
            stress in beams. To locate that content you could use the search
            terms “normal tree” and “beams." <br /> <br /> You can also simply
            click on the image of the class that you're teaching to get a full
            list of all of the teaching materials within that course. Each
            course includes weekly lecture material, homework, class worksheets,
            exams, and other useful materials such as an example course
            syllabus. Just click which topic you want to access and you'll be
            provided with all of the resources for the given topic.
          </p>
        </div>
      </div>
    </div>
  );
};
export default Home;
