"use client";
import "@mantine/core/styles.css";
import { SearchButton } from "@/components/mantine";
import Link from "next/link";
import "./page.css";
import requireAuth from "@/actions/auth/requireAuth";

const Home = async () => {
  await requireAuth();

  return (
    <main className="home-container">
      <section 
        className="banner"
        style={{
          backgroundImage: 'url("/banner.jpg")',
        }}
      >
        <h1 className="banner-title">E-SCoPe</h1>
        <p className="banner-subtitle">A searchable repository for university professors to share learning resources!</p>
      </section>

      <section className="search-section">
        <div className="content-container">
          <SearchButton />
          
          <div className="instructions-container">
            <h2 className="instructions-title">How to Use E-SCoPe</h2>
            
            <div className="instruction-steps">
              <div className="instruction-step">
                <h3>1. Search for Resources</h3>
                <p>Use the search bar above to find teaching materials by entering keywords related to your topic of interest.</p>
              </div>
              
              <div className="instruction-step">
                <h3>2. Access Resources</h3>
                <p>Select any resource to view details, download materials, and see related concepts and topics.</p>
              </div>
              
              <div className="instruction-step">
                <h3>3. Share Your Feedback</h3>
                <p>Help the community by leaving reviews on resources you've used in your teaching.</p>
              </div>
              
              <div className="instruction-step">
                <h3>4. Contribute</h3>
                <p>Have materials to share? Fill out our request form to contribute your own learning resources to the repository.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;