"use client";
import "@mantine/core/styles.css";
import { SearchButton } from "@/components/mantine";
import Link from "next/link";
import "./page.css";

const Home = () => {
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
        </div>
      </div>

      <div className="class-section">
        <Link href="/courses/statics" passHref>
          <div className="class-button">
            <img src="/class.jpg" alt="Statics" />
            <p>Statics</p>
          </div>
        </Link>
        <Link href="/courses/dynamics" passHref>
          <div className="class-button">
            <img src="/class.jpg" alt="Dynamics" />
            <p>Dynamics</p>
          </div>
        </Link>
        <Link href="/courses/strengths-of-materials" passHref>
          <div className="class-button">
            <img src="/class.jpg" alt="Strengths of Materials" />
            <p>Strengths of Materials</p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Home;
